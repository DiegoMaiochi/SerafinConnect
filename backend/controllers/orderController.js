const { Op } = require('sequelize');
const orderModel = require('../models/orderModel');
const DiscountCupom = require('../models/discountModel');
const { Order, Client, ItensPedido } = require('../models'); // ✅ CERTO
const Product = require('../models/productModel');
const sequelize = require('../config/sequelize')

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
            // Validação e aplicação do cupom
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

            // Criação do pedido
            const newOrder = await Order.create({
                totalOrder: totalOrder - discount,
                paymentType,
                status,
                tableId,
                clientId,
                discount,
                couponId
            }, { transaction });

            // Inserção dos itens
            for (const item of items) {
                console.log("Item recebido do front:", item);

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
        const { status, employeeId } = req.body; // employeeId deve vir no corpo da requisição
        const id = req.params.id;

        if (!employeeId) {
            return res.status(400).json({ error: 'ID do funcionário é obrigatório para atualizar o pedido.' });
        }

        try {
            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }

            order.status = status;

            // Atualiza o vínculo com o funcionário dependendo do status
            if (status.toLowerCase() === 'cancelado' || status.toLowerCase() === 'cancelled') {
                order.cancelledById = employeeId;
                order.completedById = null; // limpa se estava preenchido
            } else if (status.toLowerCase() === 'completo' || status.toLowerCase() === 'completed') {
                order.completedById = employeeId;
                order.cancelledById = null; // limpa se estava preenchido
            } else {
                // Se status for outro, limpa os dois campos (ou mantém, dependendo da regra de negócio)
                order.cancelledById = null;
                order.completedById = null;
            }

            await order.save();

            res.status(200).json(order);
        } catch (error) {
            console.error('Erro ao atualizar o pedido:', error);
            res.status(500).json({ error: 'Erro ao atualizar o pedido com id ' + id });
        }
    },


    getOrdersByPaymentType: async (req, res) => {
        try {
            const report = await orderModel.findAll({
                attributes: ['paymentType', [sequelize.fn('COUNT', sequelize.col('id')), 'total_orders']],
                group: ['paymentType'],
                order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
            });

            // Retorna o relatório de pedidos por tipo de pagamento
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar relatório de pedidos por tipo de pagamento.' });
        }
    },

    getPaymentReportByDateRange: async (req, res) => {
        const { startDate, endDate } = req.query;

        // Verificar se as datas foram fornecidas
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'As datas de início e fim são obrigatórias.' });
        }

        try {
            const report = await orderModel.findAll({
                attributes: ['paymentType', [sequelize.fn('COUNT', sequelize.col('id')), 'total_orders']],
                where: {
                    creationDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: ['paymentType']
            });

            res.status(200).json({
                message: 'Relatório de pedidos por tipo de pagamento',
                paymentReport: report
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar relatório de pedidos por tipo de pagamento.' });
        }
    }
};

module.exports = orderController;
