const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const LogCupomController = require('../controllers/logs/logCupomController');

/**
 * @swagger
 * /desconto/cupons:
 *   post:
 *     summary: Cria um novo cupom de desconto
 *     tags: [Descontos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cupom'
 *     responses:
 *       201:
 *         description: Cupom de desconto criado com sucesso
 *       400:
 *         description: Erro na criação do cupom - dados inválidos
 *       500:
 *         description: Erro interno ao criar cupom
 */
router.post('/cupons', discountController.createDiscountCupom);
router.get('/cupons/logs', LogCupomController.getAllLogs);

/**
 * @swagger
 * /desconto/cupons:
 *   get:
 *     summary: Lista todos os cupons de desconto
 *     tags: [Descontos]
 *     responses:
 *       200:
 *         description: Lista de cupons de desconto retornada com sucesso
 *       500:
 *         description: Erro ao obter cupons de desconto
 */
router.get('/cupons', discountController.getAllDiscountCupoms);

/**
 * @swagger
 * /desconto/cupons/{id}:
 *   get:
 *     summary: Busca um cupom de desconto pelo ID
 *     tags: [Descontos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cupom de desconto encontrado
 *       404:
 *         description: Cupom de desconto não encontrado
 *       500:
 *         description: Erro ao buscar cupom de desconto
 */
router.get('/cupons/:id', discountController.getDiscountCupomById);

/**
 * @swagger
 * /desconto/cupons/{id}:
 *   put:
 *     summary: Atualiza um cupom de desconto existente
 *     tags: [Descontos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cupom'
 *     responses:
 *       200:
 *         description: Cupom de desconto atualizado com sucesso
 *       404:
 *         description: Cupom de desconto não encontrado
 *       400:
 *         description: Erro ao atualizar cupom de desconto - dados inválidos
 *       500:
 *         description: Erro interno ao atualizar cupom
 */
router.put('/cupons/:id', discountController.updateDiscountCupom);

/**
 * @swagger
 * /desconto/cupons/{id}/inativar:
 *   put:
 *     summary: Inativa um cupom de desconto (limpa o limite de uso)
 *     tags: [Descontos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cupom de desconto inativado com sucesso
 *       404:
 *         description: Cupom de desconto não encontrado
 *       500:
 *         description: Erro ao inativar cupom
 */
router.put('/cupons/:id/inativar', discountController.deactivateDiscountCupom);

/**
 * @swagger
 * /desconto/cupons/{id}:
 *   delete:
 *     summary: Deleta um cupom de desconto pelo ID
 *     tags: [Descontos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cupom de desconto deletado com sucesso
 *       404:
 *         description: Cupom de desconto não encontrado
 *       500:
 *         description: Erro interno ao deletar cupom
 */
router.delete('/cupons/:id', discountController.deleteDiscountCupom);

module.exports = router;
