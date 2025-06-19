const { Model, DataTypes } = require('sequelize');

class Stock extends Model {
  static init(sequelize) {
    return super.init({
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'Product',  // ou 'product' dependendo do nome da tabela
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'stock',
      timestamps: true,
      modelName: 'Stock'
    });
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'productId' });
    models.Product.hasOne(this, { foreignKey: 'productId' });
  }
}

module.exports = Stock;
