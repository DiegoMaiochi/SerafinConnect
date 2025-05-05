const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Product = require('./productModel');

const Stock = sequelize.define('Stock', {
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "stock",
    timestamps: true
});

// Relacionamento com Product
Product.hasOne(Stock, { foreignKey: 'productId' });
Stock.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Stock;
