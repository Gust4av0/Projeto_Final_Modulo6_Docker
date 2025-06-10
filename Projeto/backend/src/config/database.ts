import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "aluga_ai_ze",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "localhost",  // Certifique-se de que 'database' está correto em Docker Compose
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false, // Opcional, mas útil para evitar logs excessivos no console
  }
);

export default sequelize;
