const Stock = require('../models/stockModel');

const stockController = {
    
    getStock: async (req, res) => {
        const id = req.params.id;
        try {
            const stock = await Stock.findOne({
                where: { productId: id }
            });

            if (!stock) {
                return res.status(404).json({ error: 'Estoque não encontrado para o produto com o id ' + id });
            }

            res.status(200).json(stock);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter o estoque do produto com o id ' + id });
        }
    },

    createNewStockProduct: async (req, res) => {
        const { quantity } = req.body;
        const id = req.params.id;

        try {
            // Verifica se já existe um estoque registrado para esse produto
            const existingStock = await Stock.findOne({ where: { productId: id } });

            if (existingStock) {
                return res.status(400).json({ error: 'Já existe um estoque registrado para este produto.' });
            }

            // Cria um novo estoque para o produto
            const newProductStock = await Stock.create({ productId: id, quantity });

            res.status(201).json(newProductStock);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar estoque para o produto ' + id });
        }
    },

    updateStock: async (req, res) => {
        const { quantity } = req.body;
        const id = req.params.id;

        try {
            const stockRecord = await Stock.findOne({ where: { productId: id } });

            if (!stockRecord) {
                return res.status(404).json({ error: 'Estoque não encontrado para atualização.' });
            }

            await stockRecord.update({ quantity });

            res.status(200).json({ message: 'Estoque atualizado com sucesso.', stockRecord });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o estoque do produto com id ' + id });
        }
    }
};

module.exports = stockController;
