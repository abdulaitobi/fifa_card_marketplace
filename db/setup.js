require("dotenv").config();
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const pool = require("./pool");

async function setup() {
  try {
    await pool.query(await readFile(path.join(__dirname, "schema.sql"), "utf8"));
    console.log("Players table is ready.");
  } finally {
    await pool.end();
  }
}

setup().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
