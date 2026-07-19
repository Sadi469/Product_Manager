const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Middleware: block access if not logged in
function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ success: false, message: 'Please log in first.' });
}

router.use(requireLogin);

// GET /api/products — read all
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch products.' });
    }
});

// GET /api/products/:id — read one
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch product.' });
    }
});

// POST /api/products — create
router.post('/', async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        if (!name || price === undefined || quantity === undefined) {
            return res.status(400).json({ success: false, message: 'Name, price, and quantity are required.' });
        }
        const [result] = await pool.query(
            'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)',
            [name, price, quantity]
        );
        res.status(201).json({ success: true, message: 'Product added.', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add product.' });
    }
});

// PUT /api/products/:id — update
router.put('/:id', async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const [result] = await pool.query(
            'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
            [name, price, quantity, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, message: 'Product updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update product.' });
    }
});

// DELETE /api/products/:id — delete
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, message: 'Product deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete product.' });
    }
});

module.exports = router;
