const { Router } = require("express");
const { showInventory, playerId, editPlayer, savePlayer, deletePlayer } = require("../controllers/mainController");

const mainRouter = Router();

mainRouter.param("id", (req, res, next) => playerId(req, res, next));
mainRouter.get(["/", "/searchPlayers"], showInventory);
mainRouter.post("/addPlayer", savePlayer);
mainRouter.get("/players/:id/edit", editPlayer);
mainRouter.post("/players/:id/edit", savePlayer);
mainRouter.post("/players/:id/delete", deletePlayer);

module.exports = mainRouter;
