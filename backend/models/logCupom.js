const { Model, DataTypes } = require('sequelize');

class LogCupom extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cupom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      acao: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      usuario: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
      tableName: 'log_cupons',
      timestamps: false,
      modelName: 'LogCupom',
    });
    
  }
  static associate(models) {
  this.belongsTo(models.DiscountCupom, {
    foreignKey: 'cupom_id',
    as: 'cupom'
  });
}

}

module.exports = LogCupom;
