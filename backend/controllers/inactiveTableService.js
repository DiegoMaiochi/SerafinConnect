// controllers/inactiveTableController.js
const { InactiveTable,Order,sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');

const inactiveTableService = {
  getAllTables: async () => {
    try {
      return await InactiveTable.findAll();
    } catch (error) {
      throw error;
    }
  },

  getInactiveTable: async (id) => {
    try {
      return await InactiveTable.findByPk(id);
    } catch (error) {
      throw error;
    }
  },

  createNewInactiveTable: async (status, identifier) => {
    try {
      const result = await InactiveTable.create({ status, identifier });
      return result;
    } catch (error) {
      throw error;
    }
  },
getConsumptionReport: async (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
      const result = await Order.findAll({
        attributes: [
          'tableId',
          [fn('COUNT', col('Order.id')), 'totalPedidos'],
          [fn('SUM', col('Order.totalOrder')), 'totalConsumo'],
        ],
        include: [
          {
            model: InactiveTable,
            as: 'table',
            attributes: ['id', 'identifier'],
            required: false,
          },
        ],
        where: {
          creationDate: {
            [Op.between]: [start, end],
          },
        },
        group: ['Order.tableId', 'table.id', 'table.identifier'],
      });

      return result;
    } catch (error) {
      console.error('Erro ao gerar relatório de consumo:', error);
      throw error;
    }
  },
  updateInativeTable: async (status, id) => {
    try {
      const table = await InactiveTable.findByPk(id);
      if (!table) throw new Error('Registro não encontrado');

      table.status = status;
      await table.save();
      return table;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = inactiveTableService;
