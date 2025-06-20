const { Model, DataTypes } = require('sequelize');

class ItensPedido extends Model {
  static init(sequelize) {
    return super.init({
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'product',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), // <-- Adicionado aqui
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
