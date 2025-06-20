const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { Employee } = require('../models');

const employeeController = {
    // No employeeController (exemplo simples)
getPerformanceReport: async (req, res) => {
  try {
    const report = await Order.findAll({
      attributes: [
        'completedById',
        'cancelledById',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders']
      ],
      group: ['completedById', 'cancelledById'],
      raw: true,
    });

    res.status(200).json(report);
  } catch (error) {
    console.error('Erro ao gerar relatório de desempenho:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de desempenho.' });
  }
},

  // Listar funcionários com filtros, paginação e ordenação
  getAllEmployees: async (req, res) => {
    let {
      page = 1,
      limit = 10,
      name = '',
      document = '',
      sortBy = 'name',
      order = 'ASC',
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    try {
      const where = { active: true };

      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (document) where.document = { [Op.iLike]: `%${document}%` };

      const validSortBy = ['name', 'document'];
      const validOrder = ['ASC', 'DESC'];

      const sortColumn = validSortBy.includes(sortBy) ? sortBy : 'name';
      const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

      const { count, rows } = await Employee.findAndCountAll({
        where,
        order: [[sortColumn, sortOrder]],
        limit,
        offset,
        attributes: { exclude: ['password'] }
      });

      res.status(200).json({
        data: rows,
        total: count,
        totalPages: Math.ceil(count / limit),
        page,
      });
    } catch (error) {
      console.error('Erro ao obter lista de funcionários:', error);
      res.status(500).json({ error: 'Erro ao obter lista de funcionários.' });
    }
  },

  // Buscar funcionário por ID
  getEmployee: async (req, res) => {
    const { id } = req.params;

    try {
      const employee = await Employee.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!employee || !employee.active) {
        return res.status(404).json({ error: 'Funcionário não encontrado.' });
      }

      res.status(200).json(employee);
    } catch (error) {
      console.error('Erro ao obter funcionário:', error);
      res.status(500).json({ error: 'Erro ao obter funcionário.' });
    }
  },

  // Criar novo funcionário
  createEmployee: async (req, res) => {
    const { name, document, password } = req.body;

    if (!name || !document || !password) {
      return res.status(400).json({ error: 'name, document e password são obrigatórios.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newEmployee = await Employee.create({
        name,
        document,
        password: hashedPassword,
        active: true,
      });

      const { password: _, ...employeeData } = newEmployee.toJSON();
      res.status(201).json(employeeData);
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      // Caso duplicidade no document
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Documento já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao criar funcionário.' });
    }
  },

  // Atualizar funcionário
  updateEmployee: async (req, res) => {
    const { name, document, password, active } = req.body;
    const { id } = req.params;

    try {
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ error: 'Funcionário não encontrado.' });
      }

      if (password) {
        employee.password = await bcrypt.hash(password, 10);
      }
      if (name !== undefined) employee.name = name;
      if (document !== undefined) employee.document = document;
      if (active !== undefined) employee.active = active;

      await employee.save();

      const { password: _, ...updatedEmployee } = employee.toJSON();
      res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      // Verifica conflito de chave única (document)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Documento já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao atualizar funcionário.' });
    }
  },

  // Exclusão lógica - desativa o funcionário
  deleteEmployee: async (req, res) => {
    const { id } = req.params;

    try {
      const employee = await Employee.findByPk(id);

      if (!employee || !employee.active) {
        return res.status(404).json({ error: 'Funcionário não encontrado ou já inativo.' });
      }

      employee.active = false;
      await employee.save();

      res.status(200).json({ message: 'Funcionário inativado com sucesso.' });
    } catch (error) {
      console.error('Erro ao inativar funcionário:', error);
      res.status(500).json({ error: 'Erro ao inativar funcionário.' });
    }
  }
};

module.exports = employeeController;
