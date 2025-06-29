const { Op } = require('sequelize');
const orderModel = require('../models/orderModel');
const DiscountCupom = require('../models/discountModel');
const { Order, Client, ItensPedido, LogPedido } = require('../models');
const Product = require('../models/productModel');
const sequelize = require('../config/sequelize');

const orderController = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: Client,
                        as: 'cliente',
                        attributes: ['id', 'name', 'document', 'phone', 'address']
                    },
                    {
                        model: ItensPedido,
                        as: 'ItensPedido',
                        attributes: ['orderId', 'productId', 'quantity', 'price'],
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ]
            });
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao obter lista de pedidos.' });
        }
    },

    getOrder: async (req, res) => {
        const id = req.params.id;
        try {
            const order = await orderModel.findByPk(id);
            if (!order) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter pedido com o id ' + id });
        }
    },

    createNewOrder: async (req, res) => {
        const { items, totalOrder, paymentType, status, tableId, clientId, couponCode } = req.body;

        if (!items || !totalOrder || !paymentType || !status || !tableId) {
            return res.status(400).json({ error: 'Campos obrigatórios: items, totalOrder, paymentType, status e tableId.' });
        }

        let discount = 0;
        let couponId = null;

        const transaction = await sequelize.transaction();

        try {
            if (couponCode) {
                const coupon = await DiscountCupom.findOne({
                    where: {
                        code: couponCode,
                        usageLimit: { [Op.gt]: 0 }
                    },
                    transaction
                });

                if (!coupon) {
                    await transaction.rollback();
                    return res.status(400).json({ error: 'Cupom inválido ou expirado.' });
                }

                discount = coupon.discountValue;
                couponId = coupon.id;

                await coupon.update(
                    { usageLimit: coupon.usageLimit - 1 },
                    { transaction }
                );
            }

            const newOrder = await Order.create({
                totalOrder: totalOrder - discount,
                paymentType,
                status,
                tableId,
                clientId,
                discount,
                couponId
            }, { transaction });

            for (const item of items) {
                await ItensPedido.create({
                    orderId: newOrder.id,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }, { transaction });

                const product = await Product.findByPk(item.id, { transaction });

                if (!product) {
                    throw new Error(`Produto ID ${item.id} não encontrado`);
                }

                const newStock = product.quantity - item.quantity;
                if (newStock < 0) {
                    throw new Error(`Estoque insuficiente para produto ${item.id}`);
                }

                await product.update({ quantity: newStock }, { transaction });
            }

            await transaction.commit();

            // Log da criação
            await LogPedido.create({
                pedido_id: newOrder.id,
                acao: 'created',
                usuario: 'sistema',
                detalhes: {
                    totalOrder,
                    discount,
                    paymentType,
                    items
                }
            });

            res.status(201).json({
                message: `Pedido criado com sucesso! ID = ${newOrder.id}`,
                order: newOrder
            });
        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({ error: 'Erro ao criar o novo pedido.', details: error.message });
        }
    },

  updateOrder: async (req, res) => {
  const { status, employeeId } = req.body;
  const id = req.params.id;

  if (!employeeId) {
                    employeeId = 1  }

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const oldStatus = order.status;
    order.status = status;

    const lowerStatus = status.toLowerCase();

    if (['cancelado', 'cancelled'].includes(lowerStatus)) {
      order.cancelledById = employeeId;
      order.cancelledAt = new Date();
      order.completedById = null;
      order.completedAt = null;
    } else if (['completo', 'completed', 'finalizado', 'finalized'].includes(lowerStatus)) {
      order.completedById = employeeId;
      order.completedAt = new Date();
      order.cancelledById = null;
      order.cancelledAt = null;
    } else {
      // Status intermediário ou outro qualquer
      order.cancelledById = null;
      order.cancelledAt = null;
      order.completedById = null;
      order.completedAt = null;
    }

    await order.save();

    // Log de alteração de status
    await LogPedido.create({
      pedido_id: order.id,
      acao: 'status_changed',
      usuario: `funcionario_${employeeId}`,
      detalhes: {
        de: oldStatus,
        para: status
      }
    });

    res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao atualizar o pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar o pedido com id ' + id });
  }
},


    getOrdersByPaymentType: async (req, res) => {
        try {
            const report = await Order.findAll({
                attributes: [
                    'paymentType',
                    [sequelize.fn('COUNT', sequelize.col('Order.id')), 'total_orders'],
                    [sequelize.fn('SUM', sequelize.col('Order.totalOrder')), 'total_value'],
                    [sequelize.fn('AVG', sequelize.col('Order.totalOrder')), 'avg_order_value'],
                ],
                where: {
                    creationDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                include: [
                    {
                        model: LogPedido,
                        as: 'logs',
                        attributes: ['id', 'acao', 'usuario', 'detalhes', 'criado_em']
                    }
                ],
                group: ['Order.paymentType', 'logs.id'] // Atenção aqui: o group precisa incluir campos não agregados da associação
            });


            res.status(200).json(report);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao gerar relatório de pedidos por tipo de pagamento.' });
        }
    },

    getPaymentReportByDateRange: async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'As datas de início e fim são obrigatórias.' });
  }

  try {
    const report = await Order.findAll({
      attributes: [
        'paymentType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_orders'],
        [sequelize.fn('SUM', sequelize.col('totalOrder')), 'total_value'],
        [sequelize.fn('AVG', sequelize.col('totalOrder')), 'avg_order_value'],
      ],
      where: {
        creationDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      group: ['paymentType'],
      order: [['paymentType', 'ASC']],
    });

    res.status(200).json({
      message: 'Relatório de pedidos por tipo de pagamento',
      paymentReport: report,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de pedidos por tipo de pagamento.' });
  }
}


};

module.exports = orderController;
