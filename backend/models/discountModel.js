const { Model, DataTypes } = require('sequelize');

class DiscountCupom extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },

      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      discountValue: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'discount_cupoms',
      timestamps: true,
      modelName: 'DiscountCupom'
    });
  }

  static associate(models) {
    this.hasMany(models.LogCupom, {
      foreignKey: 'cupom_id',
      as: 'logs'
    });
  }

}

module.exports = DiscountCupom;
