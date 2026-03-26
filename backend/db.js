const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "detal_db",
  password: "CavidaN0225$",
  port: 5432,
});

module.exports = pool;