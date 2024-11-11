// routes/categories.js
const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { authenticateToken } = require('../middleware/auth'); // Ensure the path is correct

console.log('authenticateToken:', authenticateToken); // Debugging

// Apply the authentication middleware to all routes below
router.use(authenticateToken);

// GET /api/categories - Get all categories for the authenticated user
router.get('/', async (req, res) => {
    try {
        console.log('Fetching categories for user ID:', req.user.id); // Debugging
        const categories = await Category.findAll({
            where: { userId: req.user.id }
        });
        console.log('Categories fetched:', categories); // Debugging
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/categories - Create a new category
router.post('/', async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Nama kategori diperlukan' });
    }

    try {
        // Check if the category already exists for the user
        const existingCategory = await Category.findOne({
            where: { name, userId: req.user.id }
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Kategori sudah ada' });
        }

        // Create the new category
        const category = await Category.create({
            name,
            userId: req.user.id
        });

        console.log('Category created:', category); // Debugging
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;