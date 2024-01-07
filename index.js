const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
app.get("/", (_, res) => {
  res.render("login");
});

app.get("/profile", (_, res) => {
  res.render("profile");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
