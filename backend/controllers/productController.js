const Product = require('../models/productModel');
const Price = require('../models/priceModel');
const Stock = require('../models/stockModel');
const sequelize = require('../config/sequelize');


const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [
                    { model: Price, attributes: ['price'] },
                    { model: Stock, attributes: ['quantity'] }
                ]
            });

            // Transformar o resultado
            const formattedProducts = products.map(product => {
                const plainProduct = product.get({ plain: true });

                return {
                    ...plainProduct,
                    price: plainProduct.Price?.price ?? null,
                    quantity: plainProduct.Stock?.quantity ?? null,
                    // removendo os objetos Price e Stock do resultado final
                };
            }).map(({ Price, Stock, ...rest }) => rest);

            res.status(200).json(formattedProducts);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter lista de produtos.' });
        }
    },

    getAllProductsByDescription: async (req, res) => {
        const description = req.params.description;
        try {
            const products = await Product.findAll({
                where: {
                    [Op.or]: [
                        { description: { [Op.iLike]: `%${description}%` } },
                        { name: { [Op.iLike]: `%${description}%` } }
                    ]
                },
                include: [Price, Stock]
            });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter lista de produtos por descrição.' });
        }
    },

    getProduct: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findByPk(id, {
                include: [Price, Stock]
            });
            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter produto.' });
        }
    },

    getProductByCode: async (req, res) => {
        const ean = req.params.ean;
        try {
            const product = await Product.findOne({
                where: { ean },
                include: [Price, Stock]
            });
            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter produto pelo código EAN.' });
        }
    },

    createNewProduct: async (req, res) => {
        const { name, ean, description, type, group, price, quantity } = req.body;

        if (!name || !ean || !description || price === undefined || quantity === undefined || !type || !group) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const t = await sequelize.transaction(); // ← inicia transação

        try {
            // Verifica se já existe produto com o EAN
            const existingProduct = await Product.findOne({ where: { ean }, transaction: t });
            if (existingProduct) {
                await t.rollback();
                return res.status(400).json({ error: 'Produto com este EAN já registrado.' });
            }

            // Cria produto
            const newProduct = await Product.create(
                { name, ean, description, type, group },
                { transaction: t }
            );

            // Cria estoque
            await Stock.create(
                { productId: newProduct.id, quantity },
                { transaction: t }
            );

            // Cria preço
            await Price.create(
                { productId: newProduct.id, price },
                { transaction: t }
            );

            await t.commit(); // ← tudo certo, confirma transação
            res.status(201).json(newProduct);

        } catch (error) {
            await t.rollback(); // ← erro em qualquer etapa, desfaz tudo
            console.error('Erro ao criar produto com transação:', error);
            res.status(500).json({ error: 'Erro ao criar novo produto.' });
        }
    },


    updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, ean, description, type, group, price, quantity } = req.body;

    if (!name || !ean || !description || price === undefined || quantity === undefined || !type || !group) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        // Verifica se o EAN está sendo alterado e se já existe outro produto com o mesmo EAN
        if (ean !== product.ean) {
            const existingProduct = await Product.findOne({ where: { ean } });
            if (existingProduct) {
                return res.status(400).json({ error: 'Outro produto com este EAN já existe.' });
            }
        }

        // Atualizar dados do produto
        await product.update({ name, ean, description, type, group });

        // Atualizar estoque
        const stock = await Stock.findOne({ where: { productId: id } });
        if (stock) {
            await stock.update({ quantity });
        } else {
            await Stock.create({ productId: id, quantity });
        }

        // Atualizar preço
        const priceEntry = await Price.findOne({ where: { productId: id } });
        if (priceEntry) {
            await priceEntry.update({ price });
        } else {
            await Price.create({ productId: id, price });
        }

        // Buscar produto atualizado com Price e Stock relacionados
        const updatedProduct = await Product.findByPk(id, {
            include: [
                { model: Price, attributes: ['price'] },
                { model: Stock, attributes: ['quantity'] }
            ]
        });

        // Formatar resultado
        const plainProduct = updatedProduct.get({ plain: true });

        const formattedProduct = {
            ...plainProduct,
            price: plainProduct.Price?.price ?? null,
            quantity: plainProduct.Stock?.quantity ?? null,
        };

        // Remover objetos aninhados Price e Stock
        delete formattedProduct.Price;
        delete formattedProduct.Stock;

        res.status(200).json({
            message: 'Produto atualizado com sucesso.',
            product: formattedProduct
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o produto.' });
    }
},




    updateProductStatus: async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido. Use "active" ou "inactive".' });
        }

        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            await product.update({ status });
            res.status(200).json({ message: 'Status atualizado com sucesso.', product });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o status do produto.' });
        }
    }

};

module.exports = productController;
