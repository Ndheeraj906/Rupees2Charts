'use strict';
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bcrypt  = require('bcryptjs');
const { Pool } = require('pg');
const path    = require('path');

const app  = express();
const pool = new Pool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME     || 'ruppes2bar',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD,
});

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use(session({
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure:   false,          // set true in production behind HTTPS
        maxAge:   8 * 60 * 60 * 1000,  // 8 hours
    },
}));

// ── POST /api/register ────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    // Validate username rules (same as client-side)
    if (username.length < 5)            return res.status(400).json({ error: 'Username must be at least 5 characters long.' });
    if (!/[A-Z]/.test(username))        return res.status(400).json({ error: 'Username must contain at least one uppercase letter.' });
    if (!/[0-9]/.test(username))        return res.status(400).json({ error: 'Username must contain at least one number.' });
    if (!/[^A-Za-z0-9]/.test(username)) return res.status(400).json({ error: 'Username must contain at least one special character.' });
    if (password.length < 6)           return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    try {
        const hash = await bcrypt.hash(password, 12);
        await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, hash]
        );
        // Auto-login after registration
        req.session.regenerate((err) => {
            if (err) return res.status(500).json({ error: 'Server error.' });
            req.session.username = username;
            res.status(201).json({ success: true, username });
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'That username is already taken.' });
        }
        console.error('Register error:', err.message);
        res.status(500).json({ error: 'Server error.' });
    }
});

// ── POST /api/login ────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        const result = await pool.query(
            'SELECT username, password_hash FROM users WHERE username = $1',
            [username]
        );
        if (result.rows.length === 0) {
            // Return the same message for missing user and wrong password (prevent enumeration)
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        const match = await bcrypt.compare(password, result.rows[0].password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        req.session.regenerate((err) => {
            if (err) return res.status(500).json({ error: 'Server error.' });
            req.session.username = result.rows[0].username;
            res.json({ success: true, username: result.rows[0].username });
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Server error.' });
    }
});

// ── POST /api/logout ───────────────────────────────────────────────────────
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Server error.' });
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// ── GET /api/me ────────────────────────────────────────────────────────────
app.get('/api/me', (req, res) => {
    if (req.session && req.session.username) {
        return res.json({ loggedIn: true, username: req.session.username });
    }
    res.json({ loggedIn: false });
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
    console.log(`Ruppes2Bar running → http://localhost:${PORT}`);
});

module.exports = { app, pool };
