// models/inactiveTableModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const InactiveTable = sequelize.define('InactiveTable', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    identifier: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'inactiveTable',
    timestamps: false
});

module.exports = InactiveTable;
