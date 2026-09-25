const { Router } = require("express");
const { searchPlayersController } = require("../controllers/mainController");
const {createPlayer} = require("../controllers/mainController");

const mainRouter = Router();

mainRouter.get("/", searchPlayersController);

mainRouter.post("/", createPlayer)

module.exports = mainRouter;
