'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      totalOrder: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Pode ser null se não for necessário
        references: {
          model: 'client',
          key: 'id',
        },
      },
      discount: {
        type: Sequelize.FLOAT,
        defaultValue: 0, // Caso não haja desconto, o valor é 0
        allowNull: false,
      },
      couponId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Se o pedido não tiver cupom, pode ser null
        references: {
          model: 'discount_cupoms', // Refere-se à tabela de cupons de desconto
          key: 'id',
        },
      },
      creationDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      }
    });

    await queryInterface.createTable('itenspedido', {
      orderId: {
        type: Sequelize.UUID,
        references: {
          model: 'orders',
          key: 'id'
        },
        allowNull: false
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product', 
          key: 'id'
        },
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remover a tabela de itens do pedido, caso precise desfazer a migração
    await queryInterface.dropTable('itenspedido');
    
    // Remover a tabela 'Orders'
    await queryInterface.dropTable('orders');
  }
};

