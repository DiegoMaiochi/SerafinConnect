const express = require('express');
const router = express.Router();
const inactiveTableController = require('../controllers/inactiveTableController');

/**
 * @swagger
 * /mesas:
 *   get:
 *     summary: Retorna todas as mesas inativas
 *     tags: [Mesas Inativas]
 *     responses:
 *       200:
 *         description: Lista de mesas inativas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InactiveTable'
 *       500:
 *         description: Erro ao buscar mesas inativas
 */
router.get('/mesas', inactiveTableController.getAllTables);

/**
 * @swagger
 * /mesa/{id}:
 *   get:
 *     summary: Retorna uma mesa inativa pelo ID
 *     tags: [Mesas Inativas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da mesa inativa
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mesa inativa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InactiveTable'
 *       404:
 *         description: Mesa inativa não encontrada
 *       500:
 *         description: Erro ao buscar mesa inativa
 */

router.get('/mesa/:id', inactiveTableController.getInactiveTable);

/**
 * @swagger
 * /mesa:
 *   post:
 *     summary: Cria uma nova mesa inativa
 *     tags: [Mesas Inativas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Identificador único da mesa
 *               status:
 *                 type: boolean
 *                 description: Status da mesa (ativa/inativa)
 *                 default: false
 *     responses:
 *       201:
 *         description: Mesa inativa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InactiveTable'
 *       500:
 *         description: Erro ao criar mesa inativa
 */
router.post('/mesa', inactiveTableController.createNewInactiveTable);

/**
 * @swagger
 * /mesa:
 *   put:
 *     summary: Atualiza uma mesa inativa existente
 *     tags: [Mesas Inativas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Identificador único da mesa
 *               status:
 *                 type: boolean
 *                 description: Status da mesa (ativa/inativa)
 *                 default: false
 *     responses:
 *       200:
 *         description: Mesa inativa atualizada com sucesso
 *       404:
 *         description: Mesa inativa não encontrada
 *       500:
 *         description: Erro ao atualizar mesa inativa
 */

// router.put('/mesa', inactiveTableController.updateInactiveTable); // Descomente se necessário

module.exports = router;
