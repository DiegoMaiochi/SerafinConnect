const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Product = require('./productModel');

const Price = sequelize.define('Price', {
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Product,
            key: 'id'
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: "price",

    timestamps: true
});

// Relacionamento com Product
Product.hasOne(Price, { foreignKey: 'productId' });
Price.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Price;
