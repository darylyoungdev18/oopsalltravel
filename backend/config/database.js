import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
export const sequelize = new Sequelize(
  
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  