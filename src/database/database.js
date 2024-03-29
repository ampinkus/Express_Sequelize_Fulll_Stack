//importo dotenv para poder usar .env
import 'dotenv/config';
// importo la clase Sequelize
import Sequelize from "sequelize";

// Creamos un objeto base de datos y lo exportamos usando los datos de .env
export const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql',  // the dialect of the database we use
  timezone: '-03:00', // Set the timezone to -3 GMT
});
