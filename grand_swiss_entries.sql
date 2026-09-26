-- Create grandSwissEntries table for IITK Grand Swiss event registration
CREATE TABLE IF NOT EXISTS "grandSwissEntries" (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) NOT NULL,
    chess_username VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    secondary_email VARCHAR(255) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS grand_swiss_entries_event_email_unique
    ON "grandSwissEntries" (COALESCE(event_id, 0), LOWER(email));

ALTER TABLE "grandSwissEntries" ENABLE ROW LEVEL SECURITY;
