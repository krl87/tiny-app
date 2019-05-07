// adding required module exports
var express = require("express");
var app = express();
var PORT = 8080; //default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// handling get request for the root/index path "homepage"
app.get("/", (req, res) => {
  res.send("Hello!");
});

//checking port and establishing localhost
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});