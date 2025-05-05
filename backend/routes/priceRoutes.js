const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.get('/preco/:id', priceController.getPrice);

module.exports = router;
