const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static init(sequelize) {
    return super.init({
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
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'product',
      timestamps: true,
      modelName: 'Product'
    });
  }

  static associate(models) {
    // Se precisar, defina associações aqui, por exemplo:
    // this.hasOne(models.Stock, { foreignKey: 'productId' });
  }
}

module.exports = Product;
