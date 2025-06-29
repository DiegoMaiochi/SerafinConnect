// models/logPedidoModel.js
const { Model, DataTypes } = require('sequelize');

class LogPedido extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            pedido_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            acao: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            usuario: {
                type: DataTypes.STRING(100),
                allowNull: true, // pode ser nome, email, ou id do funcionário
            },
            detalhes: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            criado_em: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        }, {
            sequelize,
            tableName: 'log_pedidos',
            timestamps: false,
            modelName: 'LogPedido',
        });
    }

    static associate(models) {
        this.belongsTo(models.Order, {
            foreignKey: 'pedido_id',
            as: 'pedido'
        });
       

    }
}

module.exports = LogPedido;
