// adding required module exports
var express = require("express");
var app = express();
var PORT = 8080; //default port 8080
const bodyParser = require("body-parser");

//buffer body request into string
app.use(bodyParser.urlencoded({extended: true}));
//set ejs as view engine
app.set("view engine", "ejs");

function generateRandomString() {
  var randomURL = Math.random().toString(36).substring(7);
  return randomURL;
}

//variable array with keys and values to display
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase };
  res.render("urls-index", templateVars);
});

//route to intake new URLS and pass through route below
app.get("/urls/new", (req, res) => {
  res.render("urls-new")
});

//take urls inputed into form and store them
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls-show", templateVars);
});

// redirect the short URL to long URL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});

//  calling random string function redirecting to url list
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  console.log(shortURL);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls');
});

//checking port and establishing localhost
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});


