const { Model, DataTypes } = require('sequelize');

class Order extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
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
          model: 'discountcupoms',  // nome da tabela em minúsculo (verifique o nome real)
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'orders',
      timestamps: true,
      modelName: 'Order'
    });
  }

  static associate(models) {
    this.belongsTo(models.DiscountCupom, { foreignKey: 'couponId', targetKey: 'id' });

    this.belongsTo(models.Client, { foreignKey: 'clientId', as: 'cliente' });

    this.belongsToMany(models.Product, {
      through: models.ItensPedido,
      foreignKey: 'orderId',
      otherKey: 'productId'
    });

    models.Product.belongsToMany(this, {
      through: models.ItensPedido,
      foreignKey: 'productId',
      otherKey: 'orderId'
    });

    // Se quiser usar hasMany para itens:
    this.hasMany(models.ItensPedido, { foreignKey: 'orderId', as: 'ItensPedido' });
  }
}

module.exports = Order;
