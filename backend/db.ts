import { Sequelize } from 'sequelize';
import config from './config/config';

const { development } = config;

const sequelize = new Sequelize(
  development.database,
  development.username,
  development.password,
  {
    host: development.host,
    dialect: 'postgres',
    dialectOptions: {
      multipleStatements: true,
    },
  },
);

export default sequelize;
