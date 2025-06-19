const Price = require('../models/priceModel');
const { Op } = require('sequelize');

const priceController = {
    
    getPrice: async (req, res) => {
        const id = req.params.id;
        try {
            const price = await Price.findOne({
                where: { productId: id }
            });

            if (!price) {
                return res.status(404).json({ error: 'Preço não encontrado para o produto com o id ' + id });
            }

            res.status(200).json(price);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter o preço do produto com o id ' + id });
        }
    },

    createNewPriceForProduct: async (req, res) => {
        const { price } = req.body;
        const id = req.params.id;

        try {
            // Verifica se já existe um preço registrado para esse produto
            const existingPrice = await Price.findOne({ where: { productId: id } });

            if (existingPrice) {
                return res.status(400).json({ error: 'Já existe um preço registrado para este produto.' });
            }

            // Cria um novo preço para o produto
            const newPriceProduct = await Price.create({ productId: id, price });

            res.status(201).json(newPriceProduct);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar preço para o produto ' + id });
        }
    },

    updatePrice: async (req, res) => {
        const { price } = req.body;
        const id = req.params.id;

        try {
            const priceRecord = await Price.findOne({ where: { productId: id } });

            if (!priceRecord) {
                return res.status(404).json({ error: 'Preço não encontrado para atualização.' });
            }

            await priceRecord.update({ price });

            res.status(200).json({ message: 'Preço atualizado com sucesso.', priceRecord });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o preço do produto com id ' + id });
        }
    }
};

module.exports = priceController;
