const db = require("../db/queries");
const { countries, countryNames } = require("../db/countryService");

function searchTerm(value) {
  return typeof value === "string" ? value.trim() : "";
}

function inventoryUrl(search) {
  return search ? `/searchPlayers?${new URLSearchParams({ "search-query": search })}` : "/";
}

async function renderInventory(res, search, options = {}) {
  const players = await db.listPlayers(search);
  res.render("index", {
    players, countries, countryNames, search, inventoryUrl: inventoryUrl(search),
    editing: null, values: {}, error: null, formOpen: false, ...options,
  });
}

async function showInventory(req, res) {
  await renderInventory(res, searchTerm(req.query["search-query"]));
}

function playerId(req, res, next) {
  if (!/^[1-9]\d{0,9}$/.test(req.params.id) || Number(req.params.id) > 2147483647) {
    return res.status(404).send("Card not found.");
  }
  next();
}

async function editPlayer(req, res) {
  const editing = await db.getPlayer(req.params.id);
  if (!editing) return res.status(404).send("Card not found.");
  await renderInventory(res, searchTerm(req.query["search-query"]), {
    editing,
    values: { playerName: editing.playername, nationality: editing.countryname, price: editing.price },
    formOpen: true,
  });
}

function validate({ playerName, nationality, price }) {
  if (!playerName || playerName.length > 255) return "Enter a player name of up to 255 characters.";
  if (!countryNames.has(nationality)) return "Select a valid country.";
  if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(price)) {
    return "Enter a price from 0 to 999,999,999,999.99 with up to two decimal places.";
  }
}

async function savePlayer(req, res) {
  const search = searchTerm(req.body?.search);
  const { id } = req.params;
  const editing = id ? await db.getPlayer(id) : null;
  if (id && !editing) return res.status(404).send("Card not found.");

  const values = {
    playerName: searchTerm(req.body?.playerName),
    nationality: searchTerm(req.body?.nationality).toUpperCase(),
    price: searchTerm(req.body?.price),
  };
  const error = validate(values);
  if (error) {
    return renderInventory(res.status(400), search, { error, values, editing, formOpen: true });
  }

  const { playerName, nationality, price } = values;
  if (id) {
    if (!await db.updatePlayer(id, playerName, nationality, price)) {
      return res.status(404).send("Card not found.");
    }
  } else {
    await db.addPlayer(playerName, nationality, price);
  }
  res.redirect(303, id ? inventoryUrl(search) : "/");
}

async function deletePlayer(req, res) {
  if (!await db.deletePlayer(req.params.id)) return res.status(404).send("Card not found.");
  res.redirect(303, inventoryUrl(searchTerm(req.body?.search)));
}

module.exports = { showInventory, playerId, editPlayer, savePlayer, deletePlayer };
