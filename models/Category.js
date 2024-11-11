// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: { // Pastikan ini ada dan sesuai
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Nama model Sequelize
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = Category;