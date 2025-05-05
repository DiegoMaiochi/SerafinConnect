const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/estoque/:id', stockController.getStock);
router.put('/estoque/:id', stockController.updateStock);

module.exports = router;
