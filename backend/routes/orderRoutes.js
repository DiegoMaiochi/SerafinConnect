const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Retorna todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erro ao obter lista de pedidos
 */
router.get('/pedidos', orderController.getAllOrders);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ItemPedido'
 *               totalOrder:
 *                 type: number
 *                 format: float
 *               paymentType:
 *                 type: string
 *               status:
 *                 type: string
 *               tableId:
 *                 type: integer
 *               clientId:
 *                 type: integer
 *               couponCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Campos obrigatórios não informados
 *       500:
 *         description: Erro ao criar pedido
 */
router.post('/pedido', orderController.createNewOrder);

/**
 * @swagger
 * /pedido/{id}:
 *   get:
 *     summary: Retorna um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao obter pedido
 */
router.get('/pedido/:id', orderController.getOrder);

/**
 * @swagger
 * /pedido/{id}:
 *   put:
 *     summary: Atualiza o status de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar pedido
 */
router.put('/pedido/:id', orderController.updateOrder);

/**
 * @swagger
 * /pedidos/tipoPagamento:
 *   get:
 *     summary: Retorna um relatório de pedidos por tipo de pagamento
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Relatório de pedidos por tipo de pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   paymentType:
 *                     type: string
 *                   total_orders:
 *                     type: integer
 */
router.get('/pedidos/tipoPagamento', orderController.getOrdersByPaymentType);

/**
 * @swagger
 * /pedidos/tipoPagamento&data:
 *   get:
 *     summary: Retorna um relatório de pedidos por tipo de pagamento e intervalo de datas
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: Data de início para o intervalo de pesquisa
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: Data de término para o intervalo de pesquisa
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Relatório de pedidos filtrado por data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 paymentReport:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paymentType:
 *                         type: string
 *                       total_orders:
 *                         type: integer
 */
router.get('/relatorios/pagamento', orderController.getPaymentReportByDateRange);

module.exports = router;
