//! Express Session

const express = require("express");
const port = 4000;
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "secretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//! Storing and using Session info

//! using connect-flash
// the flash is a special area of the session used for storing messages. Messages are written to flash and cleared after being displayed to the user.

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user register successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", {
    name: req.session.name,
  });
});

app.get("/count", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }

  res.send(`you sent a request ${req.session.count}`);
});

app.get("/session", (req, res) => {
  res.send("Session id saved");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
