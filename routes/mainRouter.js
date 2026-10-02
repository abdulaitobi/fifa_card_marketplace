const { Router } = require("express");
const { searchPlayersController } = require("../controllers/mainController");
const {createPlayer} = require("../controllers/mainController");
const { updatePlayerController } = require("../controllers/mainController");
const { deletePlayerController } = require("../controllers/mainController");

const mainRouter = Router();

mainRouter.get("/", searchPlayersController);

mainRouter.post("/", createPlayer);
mainRouter.post("/update", updatePlayerController);
mainRouter.post("/delete", deletePlayerController);

module.exports = mainRouter;
