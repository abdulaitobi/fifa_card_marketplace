const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost", // or wherever the db is hosted
  user: "danielabdulai",
  database: "fifa-cards",
  password: "Mnioacsiaawdtsiap@1",
  port: 5432 // The default port
});