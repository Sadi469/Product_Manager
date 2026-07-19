const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Root -> login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Create a default admin (admin / admin123) the first time the app runs
async function seedDefaultAdmin() {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) AS count FROM users');
        if (rows[0].count === 0) {
            const hashed = await bcrypt.hash('admin123', 10);
            await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashed]);
            console.log('✔ Default admin created — username: admin | password: admin123');
        }
    } catch (err) {
        console.error('Could not seed default admin. Did you run schema.sql?', err.message);
    }
}

app.listen(PORT, async () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    await seedDefaultAdmin();
});
