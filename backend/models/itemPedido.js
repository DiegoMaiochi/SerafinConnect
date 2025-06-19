const { Model, DataTypes } = require('sequelize');

class ItensPedido extends Model {
  static init(sequelize) {
    return super.init({
      orderId: {
        type: DataTypes.UUID,   // Deve ser UUID para casar com Order
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'orders',  // nome da tabela Order (em minúsculo)
          key: 'id'
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'product', // nome da tabela Product (confirme o nome real)
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      sequelize,
      tableName: 'itenspedido',
      timestamps: false,
      modelName: 'ItensPedido'
    });
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }
}

module.exports = ItensPedido;
