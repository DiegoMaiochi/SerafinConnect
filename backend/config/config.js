

require('dotenv').config(); // Para usar variáveis de ambiente com .env

module.exports = {
  development: {
    username: 'postgres',
    password: 'admin',
    database: process.env.DB_NAME || 'Estagio1',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false // Deixa como true para ver as queries no console
  }
 
};
