const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Certifique-se de que está importando a instância correta

const DiscountCupom = sequelize.define('DiscountCupom', {
    id: {
        type: DataTypes.UUID, // Identificador único
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Garante que cada cupom tenha um código único
    },
    usageLimit: {
        type: DataTypes.INTEGER, // Número máximo de utilizações
        allowNull: false,
        defaultValue: 1
    },
    discountValue: {
        type: DataTypes.FLOAT, // Valor do desconto
        allowNull: false
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    tableName: 'discount_cupoms'
});

module.exports = DiscountCupom;
