const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const Client = require('../models/Client'); // Model Sequelize

const clientController = {
  getAllClients: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      name = '',
      document = '',
      phone = '',
      email = '',
      sortBy = 'name',
      order = 'ASC',
    } = req.query;

    const offset = (page - 1) * limit;

    try {
      const where = {};

      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (document) where.document = { [Op.iLike]: `%${document}%` };
      if (phone) where.phone = { [Op.iLike]: `%${phone}%` };
      if (email) where.email = { [Op.iLike]: `%${email}%` };

      const validSortBy = ['name', 'document', 'phone', 'email'];
      const validOrder = ['ASC', 'DESC'];

      const sortColumn = validSortBy.includes(sortBy) ? sortBy : 'name';
      const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

      const { count, rows } = await Client.findAndCountAll({
        where,
        order: [[sortColumn, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['password'] }
      });

      res.status(200).json({
        data: rows,
        total: count,
        totalPages: Math.ceil(count / limit),
        page: Number(page),
      });
    } catch (error) {
      console.error('Erro ao obter lista de clientes:', error);
      res.status(500).json({ error: 'Erro ao obter lista de clientes.' });
    }
  },

  getClient: async (req, res) => {
    const { id } = req.params;

    try {
      const client = await Client.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cliente.' });
    }
  },

  getClientByDocument: async (req, res) => {
    const { id } = req.params;

    try {
      const client = await Client.findOne({
        where: { document: id },
        attributes: { exclude: ['password'] }
      });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cliente.' });
    }
  },

  createNewClient: async (req, res) => {
    const { name, document, password, phone, address, email } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newClient = await Client.create({
        name,
        document,
        password: hashedPassword,
        phone,
        address,
        email,
        status: true,
      });

      const { password: _, ...clientData } = newClient.toJSON(); // Remove a senha da resposta
      res.status(201).json(clientData);
    } catch (error) {
      console.error("Erro ao criar novo cliente:", error);
      res.status(500).json({ error: 'Erro ao criar novo cliente.', details: error.message });
    }
  },

  updateClient: async (req, res) => {
    const { name, document, password, phone, address, email, status } = req.body;
    const { id } = req.params;

    try {
      const client = await Client.findByPk(id);
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        client.password = hashedPassword;
      }

      client.name = name ?? client.name;
      client.document = document ?? client.document;
      client.phone = phone ?? client.phone;
      client.address = address ?? client.address;
      client.email = email ?? client.email;
      client.status = status ?? client.status;

      await client.save();

      const { password: _, ...updatedClient } = client.toJSON();
      res.status(200).json(updatedClient);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({ error: 'Erro ao atualizar cliente.' });
    }
  }
};

module.exports = clientController;
