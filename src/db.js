
const { Pool } = require("pg");

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "backend_uts",
  password: "yubiyupi_17",
  port: 5432
});

module.exports = db;
