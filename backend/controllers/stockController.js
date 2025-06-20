const Stock = require('../models/stockModel');
const LogEstoque = require('../models/logStock'); // <-- IMPORTANTE
const { Op } = require('sequelize');

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
        const usuario = req.user?.username || 'sistema';

        try {
            const existingStock = await Stock.findOne({ where: { productId: id } });

            if (existingStock) {
                return res.status(400).json({ error: 'Já existe um estoque registrado para este produto.' });
            }

            const newProductStock = await Stock.create({ productId: id, quantity });

            // REGISTRA LOG
            await LogEstoque.create({
                product_id: id,
                acao: 'criado',
                usuario,
                detalhes: { quantity }
            });

            res.status(201).json(newProductStock);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar estoque para o produto ' + id });
        }
    },

    updateStock: async (req, res) => {
        const { quantity } = req.body;
        const id = req.params.id;
        const usuario = req.user?.username || 'sistema';

        try {
            const stockRecord = await Stock.findOne({ where: { productId: id } });

            if (!stockRecord) {
                return res.status(404).json({ error: 'Estoque não encontrado para atualização.' });
            }

            await stockRecord.update({ quantity });

            // REGISTRA LOG
            await LogEstoque.create({
                product_id: id,
                acao: 'atualizado',
                usuario,
                detalhes: { quantity }
            });

            res.status(200).json({ message: 'Estoque atualizado com sucesso.', stockRecord });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o estoque do produto com id ' + id });
        }
    },
    getStockLogs: async (req, res) => {
        const { productId } = req.params;
        const { startDate, endDate } = req.query;

        try {
            const whereClause = {
                product_id: productId
            };

            if (startDate || endDate) {
                whereClause.criado_em = {};
                if (startDate) {
                    whereClause.criado_em[Op.gte] = new Date(startDate);
                }
                if (endDate) {
                    whereClause.criado_em[Op.lte] = new Date(endDate);
                }
            }

            const logs = await LogEstoque.findAll({
                where: whereClause,
                order: [['criado_em', 'DESC']],
                include: {
                    model: Stock,
                    as: 'stock',
                    attributes: ['quantity']
                }
            });

            res.status(200).json(logs);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar logs do estoque.', details: error.message });
        }
    },
    getStockLogsByPeriod: async (req, res) => {
        const { startDate, endDate } = req.query;

        try {
            const logs = await LogEstoque.findAll({
                where: {
                    criado_em: {
                        [Op.between]: [new Date(startDate), new Date(endDate)],
                    },
                },
                include: {
                    association: 'produto',
                    attributes: ['name', 'description']
                },
                order: [['criado_em', 'DESC']],
            });

            res.status(200).json(logs);
        } catch (error) {
            console.error('Erro ao buscar logs de estoque por período:', error);
            res.status(500).json({ error: 'Erro ao buscar logs de estoque por período', details: error.message });
        }
    }
};

module.exports = stockController;
