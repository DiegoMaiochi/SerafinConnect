const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

/**
 * @swagger
 * tags:
 *   name: Estoque
 *   description: Endpoints relacionados ao estoque de produtos
 */

/**
 * @swagger
 * /estoque/{id}:
 *   get:
 *     summary: Retorna o estoque de um produto pelo ID
 *     tags: [Estoque]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estoque encontrado para o produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       404:
 *         description: Estoque não encontrado para o produto
 *       500:
 *         description: Erro no servidor
 */
router.get('/estoque/:id', stockController.getStock);

/**
 * @swagger
 * /estoque/{id}:
 *   put:
 *     summary: Atualiza o estoque de um produto
 *     tags: [Estoque]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Estoque atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       404:
 *         description: Produto não encontrado para atualizar o estoque
 *       500:
 *         description: Erro no servidor
 */
router.put('/estoque/:id', stockController.updateStock);
router.get('/estoque/logs/:productId', stockController.getStockLogs);
router.get('/logs-periodo', stockController.getStockLogsByPeriod);

module.exports = router;
