require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const connection = async () => {
  await sequelize.authenticate();
  require('../models/user');
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  console.log('Connected to database');
};

module.exports = connection;
module.exports.sequelize = sequelize;
