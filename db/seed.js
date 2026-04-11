'use strict';
/**
 * Creates an initial application user in the ruppes2bar database.
 * Usage:
 *   node db/seed.js <username> <password>
 * Example:
 *   node db/seed.js Admin1! MySecret@99
 *
 * Username rules: min 5 chars, uppercase, digit, special character.
 * Password is hashed with bcrypt before storage — never stored in plain text.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const [,, username, password] = process.argv;

if (!username || !password) {
    console.error('Usage: node db/seed.js <username> <password>');
    process.exit(1);
}

// Validate username matches the app's rules
if (
    username.length < 5            ||
    !/[A-Z]/.test(username)        ||
    !/[0-9]/.test(username)        ||
    !/[^A-Za-z0-9]/.test(username)
) {
    console.error(
        'Username must be ≥5 chars and include an uppercase letter, a digit, and a special character.'
    );
    process.exit(1);
}

const pool = new Pool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME     || 'ruppes2bar',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD,
});

(async () => {
    try {
        const hash = await bcrypt.hash(password, 12);
        await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, hash]
        );
        console.log(`User "${username}" created successfully.`);
    } catch (err) {
        if (err.code === '23505') {
            console.error(`User "${username}" already exists.`);
        } else {
            console.error('Error creating user:', err.message);
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
