const { LogCupom, DiscountCupom } = require('../../models');

const LogCupomController = {
  async getAllLogs(req, res) {
    try {
      const { cupom_id } = req.query;

      const where = cupom_id ? { cupom_id } : undefined;

      const logs = await LogCupom.findAll({
        where,
        include: [{
          model: DiscountCupom,
          as: 'cupom',
          attributes: ['code']
        }],
        order: [['criado_em', 'DESC']]
      });

      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar logs', details: error.message });
    }
  }
};

module.exports = LogCupomController;
