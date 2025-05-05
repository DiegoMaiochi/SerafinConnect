const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/clientes', clientController.getAllClients);
router.get('/cliente/:id', clientController.getClient);
router.get('/cliente/documento/:id', clientController.getClientByDocument);
router.post('/clientes', clientController.createNewClient);
router.put('/cliente/:id', clientController.updateClient);

module.exports = router;
