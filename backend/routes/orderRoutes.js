const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/pedidos', orderController.getAllOrders);
router.get('/pedido/:id', orderController.getOrder);
router.get('/pedidos/tipoPagamento', orderController.getOrdersByPaymentType);
router.get('/pedidos/tipoPagamento&data', orderController.getPaymentReportByDateRange);
router.post('/pedido', orderController.createNewOrder);
router.put('/pedido/:id', orderController.updateOrder);

module.exports = router;
