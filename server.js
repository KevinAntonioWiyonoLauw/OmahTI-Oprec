// server.js
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Pastikan swagger.json ada di root

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Swagger Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rute
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/transactions', require('./routes/transactions'));

// Import models dan asosiasi
const models = require('./models');

// Test Database Connection and Synchronize Models
sequelize.authenticate()
    .then(() => {
        console.log('Database Connected');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Database & tables synchronized!');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
    })
    .catch(err => console.log('Error: ' + err));

module.exports = app;