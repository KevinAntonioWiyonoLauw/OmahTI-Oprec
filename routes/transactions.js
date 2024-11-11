// routes/transactions.js
const express = require('express');
const router = express.Router();
const { Transaction, Category } = require('../models'); // Mengimpor dari models/index.js
const { authenticateToken } = require('../middleware/auth');

// Terapkan middleware autentikasi ke semua rute di bawah ini
router.use(authenticateToken);

// GET /api/transactions - Mendapatkan semua transaksi untuk pengguna yang terautentikasi
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Category,
                attributes: ['id', 'name']
            }]
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/transactions - Membuat transaksi baru
router.post('/', async (req, res) => {
    const { type, amount, categoryId, date } = req.body;

    if (!type || !amount || !categoryId || !date) {
        return res.status(400).json({ message: 'Semua field diperlukan' });
    }

    try {
        const transaction = await Transaction.create({
            type,
            amount,
            categoryId,
            date,
            userId: req.user.id
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/transactions/:id - Memperbarui transaksi
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { type, amount, categoryId, date } = req.body;

    try {
        const transaction = await Transaction.findOne({
            where: { id, userId: req.user.id }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        transaction.type = type || transaction.type;
        transaction.amount = amount || transaction.amount;
        transaction.categoryId = categoryId || transaction.categoryId;
        transaction.date = date || transaction.date;

        await transaction.save();

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/transactions/:id - Menghapus transaksi
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findOne({
            where: { id, userId: req.user.id }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        await transaction.destroy();

        res.status(200).json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;