const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const Client = require('../models/Client'); // Model Sequelize
const Order = require('../models/orderModel');
const ItensPedido = require('../models/itemPedido');
const Product = require('../models/productModel');

const clientController = {
    getClientOrdersReport: async (req, res) => {
    const clientId = req.params.id;

    try {
      const orders = await Order.findAll({
        where: { clientId },
        include: [
          {
            model: ItensPedido,
            as: 'ItensPedido',
            attributes: ['productId', 'quantity', 'price'],
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });

      if (!orders.length) {
        return res.status(404).json({ message: 'Nenhum pedido encontrado para este cliente.' });
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error('Erro ao obter relatório de pedidos do cliente:', error);
      res.status(500).json({ error: 'Erro ao obter relatório de pedidos do cliente.' });
    }
  },
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

    searchClientsByName: async (req, res) => {
    const { name = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!name) {
      return res.status(400).json({ error: 'Parâmetro "name" é obrigatório para busca.' });
    }

    try {
      const { count, rows } = await Client.findAndCountAll({
        where: {
          name: { [Op.iLike]: `%${name}%` }
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['password'] },
        order: [['name', 'ASC']]
      });

      res.status(200).json({
        data: rows,
        total: count,
        totalPages: Math.ceil(count / limit),
        page: Number(page),
      });
    } catch (error) {
      console.error('Erro ao buscar clientes por nome:', error);
      res.status(500).json({ error: 'Erro ao buscar clientes por nome.' });
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
