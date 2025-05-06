const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

/**
 * @swagger
 * tags:
 *   name: Preços
 *   description: Endpoints relacionados a preços de produtos
 */

/**
 * @swagger
 * /preco/{id}:
 *   get:
 *     summary: Retorna o preço de um produto pelo ID
 *     tags: [Preços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Preço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Price'
 *       404:
 *         description: Preço não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/preco/:id', priceController.getPrice);

/**
 * @swagger
 * /preco/{id}:
 *   post:
 *     summary: Cria um novo preço para um produto
 *     tags: [Preços]
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
 *               - price
 *             properties:
 *               price:
 *                 type: number
 *                 example: 49.90
 *     responses:
 *       201:
 *         description: Preço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Price'
 *       400:
 *         description: Já existe um preço para este produto
 *       500:
 *         description: Erro no servidor
 */
router.post('/preco/:id', priceController.createNewPriceForProduct);

/**
 * @swagger
 * /preco/{id}:
 *   put:
 *     summary: Atualiza o preço de um produto existente
 *     tags: [Preços]
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
 *               - price
 *             properties:
 *               price:
 *                 type: number
 *                 example: 59.90
 *     responses:
 *       200:
 *         description: Preço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 priceRecord:
 *                   $ref: '#/components/schemas/Price'
 *       404:
 *         description: Preço não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/preco/:id', priceController.updatePrice);

module.exports = router;
