require("dotenv").config();
const express = require("express");
const path = require("node:path");
const app = express();
const mainRouter = require("./routes/mainRouter");
const { players } = require("./controllers/mainController");

app.use(express.urlencoded({extended: true}));
app.use("/searchPlayers", mainRouter);
app.use("/addPlayer", mainRouter);
app.use(express.json())
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", mainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});
