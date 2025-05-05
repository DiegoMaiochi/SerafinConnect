const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const Order = require('./orderModel'); 
const Product = require('./productModel'); 

const ItensPedido = sequelize.define('ItensPedido', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Order',
      key: 'id',
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'product',
      key: 'id', 
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'itenspedido',
  timestamps: false,
});

module.exports = ItensPedido;
