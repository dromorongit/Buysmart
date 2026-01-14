// routes/viewRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');

// Login page
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

// Register page
router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

// Dashboard - protected route
router.get('/dashboard', auth, async (req, res) => {
    try {
        // Get dashboard statistics
        const stats = {
            totalProducts: await Product.countDocuments(),
            featuredProducts: await Product.countDocuments({ isFeatured: true }),
            onSaleProducts: await Product.countDocuments({ isOnSale: true }),
            outOfStockProducts: await Product.countDocuments({ inStock: false })
        };

        // Get recent products (last 10)
        const products = await Product.find().sort({ createdAt: -1 }).limit(10);

        res.render('dashboard/index', {
            user: req.user,
            stats: stats,
            products: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Root route - redirect to login
router.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = router;