const pool = require("./pool");

async function listPlayers(search) {
  const { rows } = await pool.query(
    `SELECT id, playername, countryname, price FROM players
     WHERE $1 = '' OR strpos(lower(playername), lower($1)) > 0
     ORDER BY lower(playername), id`,
    [search]
  );
  return rows;
}

async function getPlayer(id) {
  const { rows } = await pool.query(
    "SELECT id, playername, countryname, price FROM players WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function addPlayer(name, country, price) {
  await pool.query(
    "INSERT INTO players (playername, countryname, price) VALUES ($1, $2, $3)",
    [name, country, price]
  );
}

async function updatePlayer(id, name, country, price) {
  const { rowCount } = await pool.query(
    "UPDATE players SET playername = $2, countryname = $3, price = $4 WHERE id = $1",
    [id, name, country, price]
  );
  return rowCount > 0;
}

async function deletePlayer(id) {
  const { rowCount } = await pool.query("DELETE FROM players WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = { listPlayers, getPlayer, addPlayer, updatePlayer, deletePlayer };
