// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');

// Asosiasi
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Transaction, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
    User,
    Category,
    Transaction
};