// controllers/inactiveTableController.js
const { InactiveTable } = require('../models');
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
