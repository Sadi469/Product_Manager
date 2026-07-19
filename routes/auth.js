const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const pool = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required.' });
        }

        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        res.json({ success: true, message: 'Login successful.', username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out.' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out.' });
    });
});

// GET /api/auth/session — used by the frontend to check if the user is logged in
router.get('/session', (req, res) => {
    if (req.session && req.session.userId) {
        return res.json({ loggedIn: true, username: req.session.username });
    }
    res.json({ loggedIn: false });
});

module.exports = router;
