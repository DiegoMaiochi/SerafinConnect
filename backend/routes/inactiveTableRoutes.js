const express = require('express');
const router = express.Router();
const inactiveTableController = require('../controllers/inactiveTableController');

router.get('/mesas', inactiveTableController.getAllTables);
router.get('/mesa/:id', inactiveTableController.getInactiveTable);
router.post('/mesa', inactiveTableController.createNewInactiveTable);
// router.put('/mesa', inactiveTableController.updateInactiveTable); // Descomente se necessário

module.exports = router;
