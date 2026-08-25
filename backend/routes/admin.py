import csv
import io
import bcrypt
from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from config.db import get_db_connection

admin_bp = Blueprint('admin', __name__)

# Helper to verify admin privileges
def verify_admin_privileges():
    claims = get_jwt()
    if not claims.get('is_admin'):
        return False
    return True

# Helper to log admin actions
def log_admin_action(email, action, details):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO admin_logs (admin_email, action, details) VALUES (%s, %s, %s)",
                (email, action, details)
            )
            conn.commit()
    except Exception as e:
        print(f"Failed to log admin action: {e}")
    finally:
        if conn:
            conn.close()


# --- GET STATS ---
@admin_bp.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_stats():
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # 1. Total users
            cur.execute("SELECT COUNT(*) FROM users")
            total_users = cur.fetchone()[0]

            # 2. Pending alumni requests
            cur.execute("SELECT COUNT(*) FROM alumni_requests WHERE status = 'pending'")
            pending_alumni = cur.fetchone()[0]

            # 3. LoL entries count
            cur.execute("SELECT COUNT(*) FROM \"lolEntries\"")
            lol_registrations = cur.fetchone()[0]

            # 4. FCL entries count
            cur.execute("SELECT COUNT(*) FROM \"fclEntries\"")
            fcl_registrations = cur.fetchone()[0]

            return jsonify({
                "total_users": total_users,
                "pending_alumni": pending_alumni,
                "lol_registrations": lol_registrations,
                "fcl_registrations": fcl_registrations
            }), 200
    except Exception as e:
        print(f"Admin Stats Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- GET AUDIT LOGS ---
@admin_bp.route('/api/admin/audit-logs', methods=['GET'])
@jwt_required()
def get_audit_logs():
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id, admin_email, action, details, created_at FROM admin_logs ORDER BY created_at DESC LIMIT 100")
            columns = [col[0] for col in cur.description]
            logs = [dict(zip(columns, row)) for row in cur.fetchall()]
            return jsonify(logs), 200
    except Exception as e:
        print(f"Admin Logs Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- GET ALUMNI REQUESTS ---
@admin_bp.route('/api/admin/alumni-requests', methods=['GET'])
@jwt_required()
def get_alumni_requests():
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    status_filter = request.args.get('status', 'pending')
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, email, roll_no, graduation_year, chess_username, contact, notes, status, created_at, gender FROM alumni_requests WHERE status = %s ORDER BY created_at DESC",
                (status_filter,)
            )
            columns = [col[0] for col in cur.description]
            requests = [dict(zip(columns, row)) for row in cur.fetchall()]
            return jsonify(requests), 200
    except Exception as e:
        print(f"Admin Alumni Fetch Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- APPROVE ALUMNI REQUEST ---
@admin_bp.route('/api/admin/alumni-requests/<int:request_id>/approve', methods=['POST'])
@jwt_required()
def approve_alumni_request(request_id):
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    admin_email = get_jwt_identity()
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # 1. Fetch Request Details
            cur.execute(
                "SELECT name, email, roll_no, graduation_year, chess_username, contact, gender, status FROM alumni_requests WHERE id = %s",
                (request_id,)
            )
            row = cur.fetchone()
            if not row:
                return jsonify({"error": "Request not found."}), 404
            
            name, email, roll_no, grad_year, chess_username, contact, gender, status = row
            if status != 'pending':
                return jsonify({"error": f"Request already processed (Status: {status})."}), 400

            # 2. Check if user already exists in users table
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return jsonify({"error": "A user with this email address already exists."}), 409

            # 3. Create Student User (Alumnus Account)
            import uuid
            temp_password = str(uuid.uuid4())
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(temp_password.encode('utf-8'), salt).decode('utf-8')

            cur.execute(
                "INSERT INTO users (email, chess_username, password_hash, name, roll_no, contact, secondary_email, gender, is_admin) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (email, chess_username or '', password_hash, name, roll_no or '', contact or '', '', gender or 'Male', False)
            )

            # 4. Update Request Status
            cur.execute(
                "UPDATE alumni_requests SET status = 'approved' WHERE id = %s",
                (request_id,)
            )

            conn.commit()

            # 5. Log Action
            log_admin_action(
                admin_email,
                "APPROVE_ALUMNI",
                f"Approved request ID {request_id} for email {email}."
            )

            return jsonify({
                "message": "Alumnus approved and user account created successfully."
            }), 200

    except Exception as e:
        print(f"Alumni Approval Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- REJECT ALUMNI REQUEST ---
@admin_bp.route('/api/admin/alumni-requests/<int:request_id>/reject', methods=['POST'])
@jwt_required()
def reject_alumni_request(request_id):
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    admin_email = get_jwt_identity()
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Check current status
            cur.execute("SELECT status, email FROM alumni_requests WHERE id = %s", (request_id,))
            row = cur.fetchone()
            if not row:
                return jsonify({"error": "Request not found."}), 404
            
            status, email = row
            if status != 'pending':
                return jsonify({"error": f"Request already processed (Status: {status})."}), 400

            # Update status
            cur.execute("UPDATE alumni_requests SET status = 'rejected' WHERE id = %s", (request_id,))
            conn.commit()

            # Log action
            log_admin_action(
                admin_email,
                "REJECT_ALUMNI",
                f"Rejected request ID {request_id} for email {email}."
            )

            return jsonify({"message": "Alumnus request rejected."}), 200

    except Exception as e:
        print(f"Alumni Rejection Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- GET EVENT REGISTRATIONS ---
@admin_bp.route('/api/admin/registrations/<event_name>', methods=['GET'])
@jwt_required()
def get_registrations(event_name):
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    if event_name not in ('lol', 'fcl'):
        return jsonify({"error": "Invalid event selection."}), 400

    table_name = "lolEntries" if event_name == 'lol' else "fclEntries"
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(f'SELECT id, email, name, roll_no, chess_username, contact, secondary_email, created_at FROM "{table_name}" ORDER BY created_at DESC')
            columns = [col[0] for col in cur.description]
            records = [dict(zip(columns, row)) for row in cur.fetchall()]
            return jsonify(records), 200
    except Exception as e:
        print(f"Fetch Registrations Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- DOWNLOAD CSV ---
@admin_bp.route('/api/admin/registrations/<event_name>/csv', methods=['GET'])
@jwt_required()
def get_registrations_csv(event_name):
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    if event_name not in ('lol', 'fcl'):
        return jsonify({"error": "Invalid event selection."}), 400

    table_name = "lolEntries" if event_name == 'lol' else "fclEntries"
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(f'SELECT email, name, roll_no, chess_username, contact, secondary_email, created_at FROM "{table_name}" ORDER BY created_at ASC')
            rows = cur.fetchall()

            output = io.StringIO()
            writer = csv.writer(output)
            
            # Header Row
            writer.writerow(['Email', 'Full Name', 'Roll Number', 'Chess.com Username', 'Contact Number', 'Secondary Email', 'Registered At'])
            for row in rows:
                writer.writerow(row)

            # Response setting
            filename = f"registrations_{event_name}.csv"
            return Response(
                output.getvalue(),
                mimetype="text/csv",
                headers={"Content-disposition": f"attachment; filename={filename}"}
            )

    except Exception as e:
        print(f"Export CSV Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- GET REGISTERED USERS LIST ---
@admin_bp.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_users():
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id, email, name, roll_no, chess_username, contact, gender, is_admin, created_at FROM users ORDER BY created_at DESC")
            columns = [col[0] for col in cur.description]
            users = [dict(zip(columns, row)) for row in cur.fetchall()]
            return jsonify(users), 200
    except Exception as e:
        print(f"Admin Fetch Users Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- GET STANDINGS FOR AN EVENT (PUBLIC) ---
@admin_bp.route('/api/events/<int:event_id>/standings', methods=['GET'])
def get_standings(event_id):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT standings_json FROM event_standings WHERE event_id = %s", (event_id,))
            row = cur.fetchone()
            if row:
                return jsonify(row[0]), 200
            return jsonify([]), 200
    except Exception as e:
        print(f"Fetch Standings Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()


# --- UPDATE STANDINGS FOR AN EVENT ---
@admin_bp.route('/api/admin/events/<int:event_id>/standings', methods=['POST'])
@jwt_required()
def update_standings(event_id):
    if not verify_admin_privileges():
        return jsonify({"error": "Admin access required."}), 403

    admin_email = get_jwt_identity()
    data = request.get_json() or []
    
    # Standings JSON list must be provided
    if not isinstance(data, list):
        return jsonify({"error": "Invalid standings format, must be a JSON array."}), 400

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Check if event exists
            cur.execute("SELECT title FROM events WHERE id = %s", (event_id,))
            event_row = cur.fetchone()
            if not event_row:
                return jsonify({"error": "Event not found."}), 404
            
            event_title = event_row[0]

            # Upsert standings JSON
            cur.execute("SELECT id FROM event_standings WHERE event_id = %s", (event_id,))
            standing_row = cur.fetchone()
            
            import json
            standings_str = json.dumps(data)

            if standing_row:
                cur.execute(
                    "UPDATE event_standings SET standings_json = %s, updated_at = NOW() WHERE event_id = %s",
                    (standings_str, event_id)
                )
            else:
                cur.execute(
                    "INSERT INTO event_standings (event_id, standings_json) VALUES (%s, %s)",
                    (event_id, standings_str)
                )

            conn.commit()

            # Log action
            log_admin_action(
                admin_email,
                "UPDATE_STANDINGS",
                f"Updated standings for tournament: {event_title} (ID {event_id})."
            )

            return jsonify({"message": "Standings updated successfully."}), 200

    except Exception as e:
        print(f"Update Standings Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if conn:
            conn.close()
