// adding required module exports
const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser"); //middleware for POST
const cookieParser = require("cookie-parser");

app.use(cookieParser());
//buffer body request into string
app.use(bodyParser.urlencoded({extended: true}));
//set ejs as view engine
app.set("view engine", "ejs");

//helper functions to generate random string and check if user email and password match

function generateRandomString() {
  const randomURL = Math.random().toString(36).substring(7);
  return randomURL;
}

function checkUserInfo(userEmail, userPassword) {
  for (user in users) {
    if (users[user].email === userEmail && bcrypt.compareSync(users[user].password, userPassword)); {
      return user;
    }
  }
  return false;
}

function urlsForUser(id) {
  const urls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id){
      urls[shortURL] = urlDatabase[shortURL];
    }
  }
  return urls;
}

//variable array with keys and values to display
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "test@email.com",
    password: "test"
  },
}

// handling get request for the root/index path "homepage"
app.get("/", (req, res) => {
  res.send("Welcome to TinyApp");
});

// calling object urlDatabase json page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

/* ----- ROUTES ----- */


// register

app.get("/register", (req, res) => {

    let templateVars = {
      urls: urlDatabase,
      user: users[req.cookies["user_id"]]
    };
  res.render("register", templateVars);
});

//post reg
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  let userExists = false;

  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password ) {
    res.status(400).send("400 errrrorrr");
  }
  for (user in users) {
    if(users[user].email === email) {
      userExists= true;
    }
  }
  if (userExists) {
    res.status(400).send("400 errrrorrr");
  }

  const genID = generateRandomString();
  const newUser = {
    id: genID,
    email,
    password: hashedPassword
  }

  users[genID] = newUser;
  res.cookie("user_id", genID);
  res.redirect("/urls");
});

// login
app.get("/login", (req, res) => {
  res.render("login");
});

// add login functionality
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userid = checkUserInfo(email, password)
  if (userid) {
    res.cookie("user_id", userid);
    res.redirect("/urls");
  } else {
    res.status(403).send("403 errrrorrr");
  }
});

// add logout functionality
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

//adding route of /urls-index
app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  const urls =  urlsForUser(userID);
  let templateVars = {
    urls,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls-index", templateVars);
});

//route to intake new URLS and pass through route below
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  const userId = req.cookies["user_id"];
  console.log(userId);
  if (users[userId]) {
    //console.log(users[userId])
    res.render("urls-new", templateVars);
  } else {
    res.redirect("/login");
  }
});

//  calling random string function redirecting to url list
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  console.log(shortURL);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }

  console.log(urlDatabase);

  res.redirect("/urls");
});

//take urls inputed into form and store them
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]]
  };

  res.render("urls-show", templateVars);
});

// add functionality to delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.cookies["user_id"];
  const shortU = req.params.shortURL;
  if (userId === urlDatabase[shortU].userID) {
    delete urlDatabase[shortU];
    //res.redirect("/urls");
  } else {
    console.log("this worked")
    res.redirect("/login");
  }

});

app.post("/urls/:shortURL", (req,res) => {
  const shortU = req.params.shortURL;
  const userId = req.cookies["user_id"];
  if (userId === urlDatabase[shortU].userID) {
    urlDatabase[shortU].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {

    res.redirect("/login");
  }
});

// redirect the short URL to long URL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL)
});

//checking port and establishing localhost
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});