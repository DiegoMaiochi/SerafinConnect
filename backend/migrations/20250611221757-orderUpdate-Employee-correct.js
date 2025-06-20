'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'cancelledAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'completedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'cancelledById', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

   await queryInterface.sequelize.query(`
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name='orders' AND column_name='cancelledAt'
    ) THEN
      ALTER TABLE orders ADD COLUMN "cancelledAt" TIMESTAMP;
    END IF;
  END;
  $$;
`);

  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('orders', 'cancelledAt');
    await queryInterface.removeColumn('orders', 'completedAt');
    await queryInterface.removeColumn('orders', 'cancelledById');
    await queryInterface.removeColumn('orders', 'completedById');
  }
};
