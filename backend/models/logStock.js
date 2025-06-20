const { Model, DataTypes } = require('sequelize');

class LogEstoque extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
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
      tableName: 'log_estoque',
      timestamps: false,
      modelName: 'LogEstoque',
    });
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'produto' });
    this.belongsTo(models.Stock, { foreignKey: 'product_id', as: 'stock' });
  }
}

module.exports = LogEstoque;
