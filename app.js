require("dotenv").config();
const express = require("express");
const path = require("node:path");
const mainRouter = require("./routes/mainRouter");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", mainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Could not load or save the inventory. Please try again.");
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`FIFA Card Inventory listening on port ${port}`));
}

module.exports = app;
