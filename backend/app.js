const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger');

// Rotas
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');
const priceRoutes = require('./routes/priceRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/orderRoutes');
const discountRoutes = require('./routes/discountRoutes');
const inactiveTableRoutes = require('./routes/inactiveTableRoutes');
const authRoutes = require('./routes/authRoutes');


app.use(express.json());
app.use(cors());

// Rotas agrupadas
app.use('/api', clientRoutes);
app.use('/api', productRoutes);
app.use('/api', priceRoutes);
app.use('/api', stockRoutes);
app.use('/api', orderRoutes);
app.use('/api', discountRoutes);
app.use('/api', inactiveTableRoutes);
app.use('/api', authRoutes);


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
  console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
