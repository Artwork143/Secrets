//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
// import encrypt from "mongoose-encryption";
import md5 from "md5";
// import _ from "lodash";

const app = express();
const mongodbPass = process.env.MONGODBPASS;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true});
mongoose.connect(`mongodb+srv://${mongodbPass}@cluster0.qe1zc6f.mongodb.net/userDB`, { useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//for encryption using mongoose-encryption & dotenv
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
        .then(() => {
            res.render("secrets");
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username})
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    console.log("The password you entered is incorrect.")
                }
            } else {
                console.log("Username not found.");
            }
        })
        .catch((err) => {
            console.log(err);
        });
});






app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  