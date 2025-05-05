const DiscountCupom = require('../models/discountModel');

const DiscountCupomController = {
    // Criar um novo cupom
    async createDiscountCupom(req, res) {
        try {
            const { code, usageLimit, discountValue } = req.body;

            const newCupom = await DiscountCupom.create({
                code,
                usageLimit,
                discountValue
            });

            return res.status(201).json(newCupom);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar cupom', details: error.message });
        }
    },

    // Buscar todos os cupons
    async getAllDiscountCupoms(req, res) {
        try {
            const cupoms = await DiscountCupom.findAll();
            return res.status(200).json(cupoms);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar cupons', details: error.message });
        }
    },

    // Buscar um cupom por ID
    async getDiscountCupomById(req, res) {
        try {
            const { id } = req.params;
            const cupom = await DiscountCupom.findByPk(id);

            if (!cupom) {
                return res.status(404).json({ error: 'Cupom não encontrado' });
            }

            return res.status(200).json(cupom);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar cupom', details: error.message });
        }
    },

    // Atualizar um cupom
    async updateDiscountCupom(req, res) {
        try {
            const { id } = req.params;
            const { code, usageLimit, discountValue } = req.body;

            const cupom = await DiscountCupom.findByPk(id);
            if (!cupom) {
                return res.status(404).json({ error: 'Cupom não encontrado' });
            }

            await cupom.update({ code, usageLimit, discountValue });
            return res.status(200).json(cupom);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar cupom', details: error.message });
        }
    },

    // Deletar um cupom
    async deleteDiscountCupom(req, res) {
        try {
            const { id } = req.params;
            const cupom = await DiscountCupom.findByPk(id);

            if (!cupom) {
                return res.status(404).json({ error: 'Cupom não encontrado' });
            }

            await cupom.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar cupom', details: error.message });
        }
    }
};

module.exports = DiscountCupomController;
