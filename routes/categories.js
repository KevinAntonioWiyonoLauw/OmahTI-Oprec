// routes/categories.js
const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { authenticateToken } = require('../middleware/auth'); // Ensure the path is correct

console.log('authenticateToken:', authenticateToken); // Debugging

// Apply the authentication middleware to all routes below
router.use(authenticateToken);

// GET /api/categories - Ambil daftar kategori
router.get('/', async (req, res) => {
    const userId = req.user.id;

    try {
        const categories = await Category.findAll({ where: { userId } });
        console.log('Categories fetched:', categories);
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

// PUT /api/categories/:id - Memperbarui kategori
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'Nama kategori diperlukan' });
    }

    try {
        const category = await Category.findOne({ where: { id, userId } });
        if (!category) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        }

        category.name = name;
        await category.save();

        res.status(200).json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/categories/:id - Menghapus kategori
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const category = await Category.findOne({ where: { id, userId } });
        if (!category) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        }

        await category.destroy();
        console.log('Category deleted:', category); // Debugging
        res.status(200).json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;