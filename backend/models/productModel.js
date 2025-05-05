const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Importando a instância do Sequelize

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ean: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    status: {
        type: DataTypes.ENUM('active', 'inactive'), // Define os valores possíveis
        defaultValue: 'active', // Define o padrão como "active"
        allowNull: false
    }
}, {
    tableName: 'product',    
    timestamps: true
});

module.exports = Product;
