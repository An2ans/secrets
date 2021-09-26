//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
//lvl 3: Hashing with md5
// const md5 = require("md5");

//lvl 4: bcrypt salting and hashing
const bcrypt = require("bcrypt");
const saltRounds = 10;



const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


//lvl 2: encryption using encrypt, we add the line below and select the fields, the key is in the .env
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});



const User = new mongoose.model("User", userSchema);

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });

  });

});

app.post("/login", function(req, res) {
      const username = req.body.username;
      const password = req.body.password;
      User.findOne({
        email: username
      }, function(err, foundUser) {
        if (err) {
          console.log(err);
        } else {
          if (foundUser) {
            bcrypt.compare(password, foundUser.password, function(err, result) {
              if (result === true) {
                res.render("secrets");
              } else {
                res.send("Your email and/or password are incorrect, please try again");
              }

            });
          }
        }
});
});


app.get("/", function(req, res) {
        res.render("home");
});
app.get("/login", function(req, res) {
        res.render("login");
});
app.get("/register", function(req, res) {
        res.render("register");
});

app.listen(3000, function(req, res) {
        console.log("Server is running on port 3000");
});
