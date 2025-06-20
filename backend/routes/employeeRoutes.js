const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authToken = require('../middleware/authMiddleware'); // Middleware JWT

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     summary: Lista todos os funcionários com filtros e paginação
 *     tags:
 *       - Funcionários
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade por página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro por nome
 *       - in: query
 *         name: document
 *         schema:
 *           type: string
 *         description: Filtro por documento
 *     responses:
 *       200:
 *         description: Lista de funcionários
 */
router.get('/funcionarios', authToken, employeeController.getAllEmployees);

/**
 * @swagger
 * /funcionario/{id}:
 *   get:
 *     summary: Retorna um funcionário pelo ID
 *     tags:
 *       - Funcionários
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do funcionário
 *     responses:
 *       200:
 *         description: Funcionário encontrado
 *       404:
 *         description: Funcionário não encontrado
 */
router.get('/funcionario/:id', authToken, employeeController.getEmployee);

/**
 * @swagger
 * /funcionario:
 *   post:
 *     summary: Cria um novo funcionário
 *     tags:
 *       - Funcionários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               document:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             name: "João da Silva"
 *             document: "12345678900"
 *             password: "senhaSegura123"
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *       500:
 *         description: Erro interno ao criar funcionário
 */
router.post('/funcionario', authToken, employeeController.createEmployee);

/**
 * @swagger
 * /funcionario/{id}:
 *   put:
 *     summary: Atualiza os dados de um funcionário
 *     tags:
 *       - Funcionários
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do funcionário
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               document:
 *                 type: string
 *               password:
 *                 type: string
 *               active:
 *                 type: boolean
 *           example:
 *             name: "João Silva"
 *             document: "12345678900"
 *             password: "novaSenha123"
 *             active: true
 *     responses:
 *       200:
 *         description: Funcionário atualizado com sucesso
 *       404:
 *         description: Funcionário não encontrado
 */
router.put('/funcionario/:id', authToken, employeeController.updateEmployee);

/**
 * @swagger
 * /funcionario/{id}:
 *   delete:
 *     summary: Inativa (exclusão lógica) um funcionário
 *     tags:
 *       - Funcionários
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do funcionário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Funcionário inativado com sucesso
 *       404:
 *         description: Funcionário não encontrado
 */
router.delete('/funcionario/:id', authToken, employeeController.deleteEmployee);

module.exports = router;
