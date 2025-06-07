const { Model, DataTypes } = require('sequelize');

class Price extends Model {
  static init(sequelize) {
    return super.init({
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'product', // nome da tabela, evita dependência circular
          key: 'id'
        }
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'price',
      timestamps: true,
      modelName: 'Price'
    });
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'productId' });
    models.Product.hasOne(this, { foreignKey: 'productId' });
  }
}

module.exports = Price;
