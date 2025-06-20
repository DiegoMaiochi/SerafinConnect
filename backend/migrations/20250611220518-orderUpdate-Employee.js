'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'cancelledById', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'employee', // nome da tabela do Employee
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('orders', 'completedById', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'cancelledById');
    await queryInterface.removeColumn('orders', 'completedById');
  }
};
