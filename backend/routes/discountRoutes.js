const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

router.post('/desconto', discountController.createDiscountCupom);
router.get('/desconto', discountController.getAllDiscountCupoms);
router.get('/desconto/:id', discountController.getDiscountCupomById);
router.put('/desconto/:id', discountController.updateDiscountCupom);
router.delete('/desconto/:id', discountController.deleteDiscountCupom);

module.exports = router;
