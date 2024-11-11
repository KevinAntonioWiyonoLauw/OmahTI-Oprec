// routes/transactions.js
const express = require('express');
const router = express.Router();
const { Transaction, Category, sequelize } = require('../models'); // Pastikan 'sequelize' diimpor
const { authenticateToken } = require('../middleware/auth');
const { Sequelize } = require('sequelize'); // Tambahkan ini

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
        return res.status(400).json({ message: 'Semua field diperlukan: type, amount, categoryId, date' });
    }

    try {
        // Verifikasi bahwa kategori ada dan milik pengguna
        const category = await Category.findOne({ where: { id: categoryId, userId: req.user.id } });
        if (!category) {
            return res.status(400).json({ message: 'Kategori tidak ditemukan atau tidak dimiliki oleh pengguna' });
        }

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

// PUT /api/transactions/:id - Memperbarui transaksi berdasarkan ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { type, amount, categoryId, date } = req.body;

    try {
        // Cari transaksi yang akan diperbarui dan pastikan milik pengguna
        const transaction = await Transaction.findOne({ where: { id, userId: req.user.id } });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        // Jika categoryId diubah, pastikan kategori baru valid dan milik pengguna
        if (categoryId && categoryId !== transaction.categoryId) {
            const category = await Category.findOne({ where: { id: categoryId, userId: req.user.id } });
            if (!category) {
                return res.status(400).json({ message: 'Kategori tidak ditemukan atau tidak dimiliki oleh pengguna' });
            }
        }

        // Perbarui field yang diberikan
        if (type) transaction.type = type;
        if (amount) transaction.amount = amount;
        if (categoryId) transaction.categoryId = categoryId;
        if (date) transaction.date = date;

        await transaction.save();

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/transactions/:id - Menghapus transaksi berdasarkan ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Cari transaksi yang akan dihapus dan pastikan milik pengguna
        const transaction = await Transaction.findOne({ where: { id, userId: req.user.id } });

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

// GET /api/transactions/statistics/categories - Statistik Pengeluaran per Kategori
router.get('/statistics/categories', async (req, res) => {
    try {
        const stats = await Transaction.findAll({
            attributes: [
                'categoryId',
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
            ],
            where: {
                userId: req.user.id,
                type: 'expense'
            },
            group: ['categoryId'],
            include: [{
                model: Category,
                attributes: ['name']
            }]
        });

        const formattedStats = stats.map(stat => ({
            category: stat.Category.name,
            totalAmount: stat.get('totalAmount')
        }));

        res.status(200).json(formattedStats);
    } catch (error) {
        console.error('Error fetching category statistics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/transactions/statistics/monthly - Statistik Pengeluaran Bulanan
router.get('/statistics/monthly', async (req, res) => {
    try {
        const stats = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%Y-%m'), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
            ],
            where: {
                userId: req.user.id,
                type: 'expense'
            },
            group: ['month'],
            order: [[Sequelize.literal('month'), 'ASC']]
        });

        const formattedStats = stats.map(stat => ({
            month: stat.get('month'),
            totalAmount: stat.get('totalAmount')
        }));

        res.status(200).json(formattedStats);
    } catch (error) {
        console.error('Error fetching monthly statistics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;