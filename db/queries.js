const pool = require("./pool");

async function searchPlayers(query) {
  try{
    const player = await pool.query(
        "SELECT * FROM players WHERE playername ILIKE $1",
        [`%${query}%`]
    );

    return player.rows;
  }
  catch(error){
    console.error("Error retrieving player:", error);
    throw error;
  }
};

async function addPlayer(playerName, nationality, price){
    await pool.query(
        "INSERT INTO players (playername, countryname, price) VALUES ($1, $2, $3)",
        [playerName, nationality, price]
    )
}

async function getCountryByName(req, res) {
  const { countryName } = req.params;

  try{
    const country = await db.getCountryByName(countryName);

    if (!country) {
        res.status(404).send("Country not found");
        return;
    }

    res.send(`Country Name: ${countryName}`);
    }   
    catch{
    console.error("Error retrieving author:", error);
    res.status(500).send("Internal Server Error");
  }
};

async function updatePlayer(playerId, playerName, nationality, price) {
    await pool.query(
        "UPDATE players SET playername = $1, countryname = $2, price = $3 WHERE id = $4",
        [playerName, nationality, price, playerId]
    );
}

async function deletePlayer(playerId) {
    await pool.query(
        "DELETE FROM players WHERE id = $1",
        [playerId]
    );
}

module.exports = {
  searchPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer
};
