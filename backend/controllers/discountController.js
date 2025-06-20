const DiscountCupom = require('../models/discountModel');
const { LogCupom } = require('../models');

const DiscountCupomController = {
    async createDiscountCupom(req, res) {
        try {
            console.log('Payload recebido:', req.body);  // <--- Aqui
            const { code, usageLimit, discountValue } = req.body;

            // verifica duplicado
            const existing = await DiscountCupom.findOne({ where: { code } });
            if (existing) {
                return res.status(400).json({ error: 'Código de cupom já existe' });
            }

            const newCupom = await DiscountCupom.create({
                code,
                usageLimit,
                discountValue
            });

            return res.status(201).json(newCupom);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar cupom', details: error.message });
        }
    }
    ,

    async getAllDiscountCupoms(req, res) {
        try {
            const cupoms = await DiscountCupom.findAll();
            return res.status(200).json(cupoms);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar cupons', details: error.message });
        }
    },

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

    async updateDiscountCupom(req, res) {
        try {
            const { id } = req.params;
            const { code, usageLimit, discountValue } = req.body;
            const usuario = req.user?.username || 'sistema';

            const cupom = await DiscountCupom.findByPk(id);
            if (!cupom) {
                return res.status(404).json({ error: 'Cupom não encontrado' });
            }

            await cupom.update({ code, usageLimit, discountValue });

            await LogCupom.create({
                cupom_id: id,
                acao: 'atualizado',
                usuario,
                detalhes: { code, usageLimit, discountValue }
            });

            return res.status(200).json(cupom);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar cupom', details: error.message });
        }
    },

    async deactivateDiscountCupom(req, res) {
        try {
            const { id } = req.params;
            const usuario = req.user?.username || 'sistema';

            const cupom = await DiscountCupom.findByPk(id);
            if (!cupom) {
                return res.status(404).json({ error: 'Cupom não encontrado' });
            }

            await cupom.update({ usageLimit: 0 });

            await LogCupom.create({
                cupom_id: id,
                acao: 'inativado',
                usuario,
                detalhes: { usageLimit: 0 }
            });

            return res.status(200).json({ message: 'Cupom inativado com sucesso!' });
        } catch (error) {
            console.error('Erro ao inativar cupom:', error);
            return res.status(500).json({ error: 'Erro ao inativar cupom.', details: error.message });
        }
    }
    ,

    async deleteDiscountCupom(req, res) {
        try {
            const { id } = req.params;
            const usuario = req.user?.username || 'sistema';

            const cupom = await DiscountCupom.findByPk(id);
            if (!cupom) {
                return res.status(404).json({ error: 'Cupom não encontrado' });
            }

            await cupom.destroy();

            await LogCupom.create({
                cupom_id: id,
                acao: 'deletado',
                usuario,
                detalhes: null
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar cupom', details: error.message });
        }
    },
};

module.exports = DiscountCupomController;
