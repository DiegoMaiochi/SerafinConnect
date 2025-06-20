'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('log_estoque', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      acao: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      usuario: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      detalhes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      criado_em: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('log_estoque');
  },
};
