//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
mongoose.set('strictQuery',false);

mongoose.connect("mongodb://127.0.0.1/usersDB",{useNewUrlParser: true});
const app = express();
app.set('view engine', 'ejs');
console.log(process.env.API_KEY)

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

app.get(".env",function(req,res){
userSchema.plugin(encrypt, {secret: req.body.SECRET, encryptedFields: ["password"] });
})

const User = new mongoose.model("User",userSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.render("home");
})
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
});
user.save(function(err){
  if(err){
    console.log(err);
  } else{
    res.render("secrets");
  }
});
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
  User.findOne({email: username}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }
        }
      }
  })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});