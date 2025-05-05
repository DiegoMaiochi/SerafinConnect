const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/produtos', productController.getAllProducts);

/**
 * @swagger
 * /produto/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags:
 *       - Produtos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               name: "Sabonete Antisséptico"
 *               ean: "7891234567890"
 *               description: "Sabonete líquido antibacteriano"
 *               type: "Higiene Pessoal"
 *               group: "Cuidados Diários"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Produto não encontrado."
 */
router.get('/produto/:id', productController.getProduct);

router.get('/produto/codigo/:id', productController.getProductByCode);
router.get('/produto/descricao/:id', productController.getAllProductsByDescription);

/**
 * @swagger
 * /produto:
 *   post:
 *     summary: Cria um novo produto
 *     tags:
 *       - Produtos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: "Sabonete Antisséptico"
 *             ean: "7891234567890"
 *             description: "Sabonete líquido antibacteriano"
 *             type: "Higiene Pessoal"
 *             group: "Cuidados Diários"
 *             price: 9.99
 *             quantity: 100
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               name: "Sabonete Antisséptico"
 *               ean: "7891234567890"
 *               description: "Sabonete líquido antibacteriano"
 *               type: "Higiene Pessoal"
 *               group: "Cuidados Diários"
 *               createdAt: "2025-05-04T12:00:00Z"
 *               updatedAt: "2025-05-04T12:00:00Z"
 *       400:
 *         description: Requisição inválida ou produto já existente
 *         content:
 *           application/json:
 *             example:
 *               error: "Produto com este EAN já registrado."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao criar novo produto."
 */
router.post('/produto', productController.createNewProduct);

/**
 * @swagger
 * /produto/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags:
 *       - Produtos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: "Sabonete Líquido"
 *             ean: "7891234567890"
 *             description: "Sabonete líquido antibacteriano com vitamina E"
 *             type: "Higiene Pessoal"
 *             group: "Cuidados Diários"
 *             price: 10.99
 *             quantity: 150
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               name: "Sabonete Líquido"
 *               ean: "7891234567890"
 *               description: "Sabonete líquido antibacteriano com vitamina E"
 *               type: "Higiene Pessoal"
 *               group: "Cuidados Diários"
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: Produto não encontrado
 */
router.put('/produto/:id', productController.updateProduct);


module.exports = router;
