module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('itenspedido', 'price', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('itenspedido', 'price');
  }
};
