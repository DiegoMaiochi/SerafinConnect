'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('log_cupons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      cupom_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'discount_cupoms',  
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
    await queryInterface.dropTable('log_cupons');
  }
};
