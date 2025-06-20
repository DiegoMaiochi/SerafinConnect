const { Model, DataTypes } = require('sequelize');

class Employee extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      document: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      tableName: 'employee',
      modelName: 'Employee',
      timestamps: true
    });
  }

  static associate(models) {
    // Um funcionário pode cancelar vários pedidos
    this.hasMany(models.Order, { as: 'cancelledOrders', foreignKey: 'cancelledById' });

    // Um funcionário pode completar vários pedidos
    this.hasMany(models.Order, { as: 'completedOrders', foreignKey: 'completedById' });
  }
}

module.exports = Employee;
