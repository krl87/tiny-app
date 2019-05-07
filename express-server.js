// adding required module exports
var express = require("express");
var app = express();
var PORT = 8080; //default port 8080

//set ejs as view engine
app.set("view engine", "ejs");

//variable array with keys and values to display
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// handling get request for the root/index path "homepage"
app.get("/", (req, res) => {
  res.send("Hello!");
});

// route for /hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// calling object urlDatabase json page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//adding route of /urls-index
app.get("/urls", function(req, res) => {
  let templateVars = {urls: urlDatabase };
  res.render("urls-index", templateVars);
});

//checking port and establishing localhost
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});