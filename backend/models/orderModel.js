const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const DiscountCupom = require('./discountModel'); // Certifique-se de que o caminho está correto

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID, // Identificador único do pedido
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    totalOrder: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    paymentType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tableId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    couponId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'DiscountCupoms',
            key: 'id'
        }
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    tableName: 'orders'
});

// Relacionamento com DiscountCupom
Order.belongsTo(DiscountCupom, { foreignKey: 'couponId', targetKey: 'id' });
const ItensPedido = require('./itemPedido');
const Product = require('./productModel');

Order.belongsToMany(Product, {
  through: ItensPedido,
  foreignKey: 'orderId',
  otherKey: 'productId'
});

Product.belongsToMany(Order, {
  through: ItensPedido,
  foreignKey: 'productId',
  otherKey: 'orderId'
});

module.exports = Order;
