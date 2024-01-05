const express = require("express");
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const passport = require("passport")
const {body, validationResult } = require("express-validator");
// const initPass = require('./passport-config')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const checkAuth = require('./checkAuth.js')
const mongoose = require("mongoose");
const path = require("path");
const send = require("send");
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
const Users = require("./models/Users");
const ToDos = require("./models/ToDos");
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
console.log("CONNECT");
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

let saveToken = new Set();

const app  = express()
const port  = 3000
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "AAAABBDCDAF",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.post("/api/user/register",
isNotAuth,  
body("email").trim().escape(),
body("email").isEmail(),
body("password").isLength({min: 8}),
body("password").matches('[0-9]').withMessage('Password Must Contain a Number'),
body("password").matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter'),
body("password").matches('[a-z]').withMessage('Password Must Contain an Lowercase Letter'),
body("password").matches('[~`!@#$%^&*()-_+={}[]|\;:"<>,./?]'),
async (req , res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }  
    const {email, password} = req.body;
    Users.findOne({email: email})
    .then(async (user)=> {
        console.log(user)
        if(!user) {
            let new_pass 
            await bcrypt
            .genSalt(10)
            .then(salt => {
                bcrypt.hash(password, salt)
                .then((result) => {
                    new_pass = result
                    new Users({
                        email: email,
                        password: new_pass
                    }).save()
                    res.send({status: "ok"})
                    console.log("registered")
                })
            })
        } else {
            res.status(403).send({email: "Email already in use"})
        }
    })
})


function isAuth(req, res, next) {
    const token = req.headers["cookie"];
    console.log(token)
    console.log("checkAuth")
    if (token) {
        next();
        return;
    }
    res.status(401).send()
}

app.get("/api/private", isAuth, (req, res) => {
    const token = req.headers["cookie"].split('=')[1];
    const data = jwt.verify(token, "AAABBBADA");
    return res.send({email: data.email})
})

function isNotAuth(req, res, next) {
    if (req.headers["cookie"]) return res.redirect("/")
    next();
}

app.get("/", (req, res) => {
    res.send("redirected")
})

app.get("/api/todos/list", (req, res) => {
    const token = req.headers["cookie"].split('=')[1];
    const data = jwt.verify(token, "AAABBBADA");
    ToDos.findOne({user: data.id})
    .then(async (user) => {
        if(!user) {
            res.send({ items: []})
        } else {
            res.send({ items: user.items})
        }
    })
})


app.post("/api/todos", isAuth, (req, res) => {
    const {items} = req.body;
    const token = req.headers["cookie"].split('=')[1];
    const data = jwt.verify(token, "AAABBBADA");
    ToDos.findOne({user: data.id})
    .then(async (user) => {
        if(!user) {
            new ToDos({
                user: data.id,
                items: items
            }).save()
            res.status(200).send("ok")
        } else {
            let ar = user.items.concat(items)
            console.log(ar)
            await ToDos.updateOne({user: data.id}, { items: ar });
            res.status(200).send("ok")
        }
    })
})

app.post("/api/user/login",
isNotAuth,
body("email").trim().escape(),
async (req, res) => {
    const {email, password} = req.body;
    Users.findOne({email: email})
    .then ((user) => {
        if(user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err
                if(isMatch) {
                let jwtToken = {
                    id: user._id,
                    email: user.email
                }
                jwt.sign(
                    jwtToken,
                    "AAABBBADA",
                    (err, token) => {
                        if (err) return res.send({"success": false, "message": "Invalid credentials"})
                        res.cookie('connect.sid', token)
                        saveToken.add(token);
                        passport.authenticate('local')
                        res.send({"success": true, "token": token})
                    }
                );
            } else {
                res.send({"success": false, "message": "Invalid credentials"})
            }
        })
        } else {
            res.send({"success": false, "message": "Invalid credentials"})
        }
    })
})

app.listen(port, () => {
    console.log("Server listen!")
})