const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SerafinConnect API',
      version: '1.0.0',
      description: 'Documentação da API do sistema SerafinConnect',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      schemas: {
        Client: {
          type: 'object',
          required: ['name', 'document', 'password'], // campos obrigatórios conforme o model
          properties: {
            id: {
              type: 'integer',
              readOnly: true,
              description: 'ID único do cliente (gerado automaticamente)'
            },
            name: {
              type: 'string',
              description: 'Nome do cliente'
            },
            document: {
              type: 'string',
              description: 'Número único do documento do cliente'
            },
            password: {
              type: 'string',
              description: 'Senha do cliente (hash ou plaintext, dependendo do contexto de uso)'
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Telefone do cliente'
            },
            address: {
              type: 'string',
              nullable: true,
              description: 'Endereço do cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              nullable: true,
              description: 'E-mail do cliente'
            },
            status: {
              type: 'boolean',
              description: 'Indica se o cliente está ativo',
              default: true
            }
          }
        },

        Cupom: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID único do cupom' },
            code: { type: 'string', description: 'Código do cupom' },
            usageLimit: { type: 'integer', description: 'Número máximo de usos' },
            discountValue: { type: 'number', description: 'Valor do desconto' },
            createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Última atualização' }
          }
        },
        InactiveTable: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único da tabela inativa' },
            status: { type: 'boolean', description: 'Status da tabela (ativa/inativa)' },
            identifier: { type: 'string', description: 'Identificador único da tabela' }
          }
        },
        ItensPedido: {
          type: 'object',
          properties: {
            orderId: { type: 'integer', description: 'ID do pedido associado' },
            productId: { type: 'integer', description: 'ID do produto associado' },
            quantity: { type: 'integer', description: 'Quantidade do produto no pedido' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID único do pedido' },
            totalOrder: { type: 'number', description: 'Valor total do pedido' },
            paymentType: { type: 'string', description: 'Tipo de pagamento' },
            status: { type: 'string', description: 'Status do pedido' },
            tableId: { type: 'integer', description: 'ID da mesa associada' },
            clientId: { type: 'integer', description: 'ID do cliente associado' },
            creationDate: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
            discount: { type: 'number', description: 'Valor de desconto aplicado' },
            couponId: { type: 'string', format: 'uuid', description: 'ID do cupom de desconto aplicado' }
          }
        },
        Price: {
          type: 'object',
          properties: {
            productId: { type: 'integer', description: 'ID do produto associado ao preço' },
            price: { type: 'number', description: 'Valor do produto' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único do produto' },
            name: { type: 'string', description: 'Nome do produto' },
            ean: { type: 'string', description: 'Código de barras EAN do produto' },
            description: { type: 'string', description: 'Descrição do produto' },
            group: { type: 'string', description: 'Grupo do produto' },
            type: { type: 'string', description: 'Tipo do produto' },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Status do produto',
              default: 'active'
            }
          }
        },
        Stock: {
          type: 'object',
          properties: {
            productId: { type: 'integer', description: 'ID do produto associado ao estoque' },
            quantity: { type: 'integer', description: 'Quantidade disponível do produto' }
          }
        },
        Employee: {
          type: 'object',
          required: ['name', 'document', 'password'],
          properties: {
            id: {
              type: 'integer',
              readOnly: true,
              description: 'ID único do funcionário (gerado automaticamente)'
            },
            name: {
              type: 'string',
              description: 'Nome do funcionário'
            },
            document: {
              type: 'string',
              description: 'Número do documento do funcionário (ex: CPF)'
            },
            password: {
              type: 'string',
              description: 'Senha do funcionário (armazenada com hash)'
            },
            active: {
              type: 'boolean',
              description: 'Status do funcionário (ativo ou inativo)',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do funcionário'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização do funcionário'
            }
          }
        }

      }
    }
  },
  apis: ['./routes/*.js'] // Rotas com anotações Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
