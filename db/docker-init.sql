-- Docker entrypoint init script.
-- The database is already created by the POSTGRES_DB environment variable,
-- so we only need to create the application tables here.

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255)       NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);
