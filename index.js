const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const loginidAppId = process.env.LOGINID_APP_ID;
const loginidBaseUrl = process.env.LOGINID_BASE_URL;

// Session for cookies
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const isAuthenticated = (req, res, next) => {
  if (req.session?.authenticated) {
    return next();
  }
  res.redirect("/");
};

// Routes
app.get("/", (req, res) => {
  if (req.session?.authenticated) {
    return res.redirect("/profile");
  }
  res.render("login", { loginidAppId, loginidBaseUrl });
});

app.post("/login", (req, res) => {
  const { username, token } = req.body;
  if (!username || !token) {
    return res.status(400).send({
      code: "missing_params",
      message: "Username and token must be provided",
    });
  }

  //TODO: when token verify endpoint is ready, use it here
  //verify access token

  req.session.username = username;
  req.session.authenticated = true;
  res.redirect("/profile");
});

app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { username: req.session.username });
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
