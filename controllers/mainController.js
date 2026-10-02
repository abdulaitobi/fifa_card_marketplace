import { searchPlayers } from "../db/queries.js";
import { getCountries } from "../db/countryService.js";
import { addPlayer } from "../db/queries.js"
import { updatePlayer } from "../db/queries.js";
import { deletePlayer } from "../db/queries.js";

export const searchPlayersController = async (req, res) => {
  const query = req.query["search-query"]?.trim();

  try {
    const countries = await getCountries();

    if (!query) {
      return res.render("index", { countries, selected: null });
    }

    const player = await searchPlayers(query);
    res.render("index", { countries, player, selected: null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const createPlayer = async (req, res) => {
  const { playerName, nationality, price } = req.body;
  const countries = await getCountries();

  // The country's ISO alpha-2 code is used only to render the flag on the
  // page after saving - it is not persisted alongside the player record.
  const country = countries.find((c) => c.code === nationality);

  if (!country) {
    return res.status(400).render("index", {
      countries,
      selected: null,
      error: "Please select a valid country",
    });
  }

  try {
    await addPlayer(playerName, nationality, price);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const renderForm = async (req, res) => {
  try {
    const countries = await getCountries();
    res.render("index", { countries, selected: null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const updatePlayerController = async (req, res) => {
  const { playerId, playerName, nationality, price } = req.body;

  try {
    await updatePlayer(playerId, playerName, nationality, price);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const deletePlayerController = async (req, res) => {
  const { playerId } = req.body;

  try {
    await deletePlayer(playerId);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};