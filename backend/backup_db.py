import os
import sys
import datetime
import subprocess
from dotenv import load_dotenv

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
load_dotenv(os.path.join(backend_dir, '.env'))

from config.db import get_db_connection

def create_database_backup():
    backups_dir = os.path.join(backend_dir, 'backups')
    os.makedirs(backups_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filepath = os.path.join(backups_dir, f"supabase_backup_{timestamp}.sql")
    
    host = os.environ.get('DB_HOST')
    port = os.environ.get('DB_PORT', '5432')
    user = os.environ.get('DB_USER')
    password = os.environ.get('DB_PASSWORD')
    dbname = os.environ.get('DB_NAME')
    
    print(f"Starting Supabase database backup for '{dbname}' on {host}...")
    
    # Try pg_dump first if available
    pg_dump_path = None
    for path in ["pg_dump", "/opt/homebrew/bin/pg_dump", "/usr/local/bin/pg_dump"]:
        try:
            res = subprocess.run([path, "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if res.returncode == 0:
                pg_dump_path = path
                break
        except Exception:
            continue

    if pg_dump_path:
        env = os.environ.copy()
        env['PGPASSWORD'] = password
        cmd = [
            pg_dump_path,
            "-h", host,
            "-p", str(port),
            "-U", user,
            "-d", dbname,
            "-f", output_filepath
        ]
        try:
            res = subprocess.run(cmd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if res.returncode == 0:
                size_mb = os.path.getsize(output_filepath) / (1024 * 1024)
                print(f"✅ SUCCESS: pg_dump backup saved to: {output_filepath} ({size_mb:.2f} MB)")
                return output_filepath
        except Exception as err:
            print(f"pg_dump attempt note: {err}")

    # Fallback to Python SQL exporter using psycopg connection
    print("Using Python SQL Exporter fallback...")
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """)
            tables = [r[0] for r in cur.fetchall()]
            
            with open(output_filepath, 'w', encoding='utf-8') as f:
                f.write(f"-- Supabase PostgreSQL Database Backup\n")
                f.write(f"-- Generated At: {datetime.datetime.now().isoformat()}\n")
                f.write(f"-- Host: {host}\n\n")
                
                for table in tables:
                    f.write(f"-- --------------------------------------------------\n")
                    f.write(f"-- Table: \"{table}\"\n")
                    f.write(f"-- --------------------------------------------------\n")
                    
                    cur.execute(f'SELECT * FROM "{table}";')
                    col_names = [col[0] for col in cur.description]
                    rows = cur.fetchall()
                    
                    f.write(f"-- Rows count: {len(rows)}\n")
                    for row in rows:
                        vals = []
                        for val in row:
                            if val is None:
                                vals.append("NULL")
                            elif isinstance(val, (int, float)):
                                vals.append(str(val))
                            elif isinstance(val, bool):
                                vals.append("TRUE" if val else "FALSE")
                            else:
                                clean_val = str(val).replace("'", "''")
                                vals.append(f"'{clean_val}'")
                        cols_str = ', '.join([f'"{c}"' for c in col_names])
                        vals_str = ', '.join(vals)
                        f.write(f'INSERT INTO "{table}" ({cols_str}) VALUES ({vals_str});\n')
                    f.write("\n")

        size_mb = os.path.getsize(output_filepath) / (1024 * 1024)
        print(f"✅ SUCCESS: Python SQL Backup saved to: {output_filepath} ({size_mb:.2f} MB)")
        return output_filepath

    except Exception as e:
        print(f"❌ Backup failed: {e}")
        raise
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    create_database_backup()
