// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid' });
        }
        req.user = user;
        console.log('Authenticated User:', req.user); // Debugging
        next();
    });
};

module.exports = { authenticateToken };