'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('price', {
            productId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'product',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            price: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('price');
    }
};

