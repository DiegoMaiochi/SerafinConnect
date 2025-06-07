const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authToken = require('../middleware/authMiddleware');


/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes com filtros e paginação
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: document
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, document, phone, email]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 */
router.get('/clientes', clientController.getAllClients);

/**
 * @swagger
 * /cliente/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/cliente/:id', clientController.getClient);

/**
 * @swagger
 * /cliente/documento/{id}:
 *   get:
 *     summary: Busca um cliente pelo número do documento
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/cliente/documento/:id', clientController.getClientByDocument);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Erro na criação do cliente - dados inválidos
 *       500:
 *         description: Erro interno ao criar cliente
 */
router.post('/clientes', clientController.createNewClient);

/**
 * @swagger
 * /cliente/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       400:
 *         description: Erro ao atualizar cliente - dados inválidos
 */
router.put('/cliente/:id', clientController.updateClient);
router.get('/clientes/search', clientController.searchClientsByName);

module.exports = router;
