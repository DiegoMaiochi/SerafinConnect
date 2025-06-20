const inactiveTableService = require('../controllers/inactiveTableService');

const inactiveTableController = {
  getAllTables: async (req, res) => {
    try {
      const tables = await inactiveTableService.getAllTables();
      res.status(200).json(tables);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar mesas.' });
    }
  },

  getInactiveTable: async (req, res) => {
    try {
      const id = req.params.id;
      const table = await inactiveTableService.getInactiveTable(id);
      if (!table) {
        return res.status(404).json({ error: 'Mesa não encontrada.' });
      }
      res.status(200).json(table);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar a mesa.' });
    }
  },

  createNewInactiveTable: async (req, res) => {
    try {
      const { status, identifier } = req.body;
      const result = await inactiveTableService.createNewInactiveTable(status, identifier);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar a mesa.' });
    }
  },

  updateInactiveTable: async (req, res) => {
    try {
      const { id, status } = req.body;
      const result = await inactiveTableService.updateInativeTable(status, id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar a mesa.' });
    }
  }
};

module.exports = inactiveTableController;
