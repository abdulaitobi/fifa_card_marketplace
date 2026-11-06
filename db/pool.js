const { Pool } = require("pg");

module.exports = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || (process.platform === "darwin" ? "/tmp" : "localhost"),
        database: process.env.PGDATABASE || "fifa-cards",
      }
);
