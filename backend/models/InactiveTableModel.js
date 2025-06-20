const { Model, DataTypes } = require('sequelize');

class InactiveTable extends Model {
  static init(sequelize) {
    return super.init({
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
      sequelize,
      tableName: 'inactiveTable',
      timestamps: false,
      modelName: 'InactiveTable'
    });
  }
  static associate(models) {
    // associações futuras
  }
}

module.exports = InactiveTable;
