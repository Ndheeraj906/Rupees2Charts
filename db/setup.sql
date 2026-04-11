-- Run once as your PostgreSQL superuser to set up the Ruppes2Bar database.
-- Example: psql -U postgres -f db/setup.sql

-- 1. Create the database
CREATE DATABASE ruppes2bar;

-- 2. Connect to it and create the users table
\c ruppes2bar

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255)       NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);
