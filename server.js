const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const mongoConnect = require("./database/db").mongoConnect;
const UserSchema = require("./model/user.model");
const CardSchema = require("./model/card.schema");
const Card = require("./database/card");
const PORT = process.env.PORT || 8005

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.use(bodyParser.json())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get("/", (req,res) => {
    res.send(`<h1>NODE Js.</h1>`)
})


//AUTHENTICATION ROUTES

app.post("/auth/signUp", async (req,res)=>{
    let username = req.body.username
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    const user = await UserSchema.find({username})

    if(user.length>0){
        res.json({
            status: 400,
            message: "Username already exists!"
        })
    } else {
        if(password !== confirmPassword){
            res.json({
                status: 400,
                message: "Password mismatch!!"
            })
        } else{
            bcrypt.hash(password, 8, function(err, hash){
                if(err){
                    throw err
                }
                console.log(hash)
                let user = new UserSchema({password:hash, username})
                user.save(function (err) {
                    if(err){
                        console.log(err);
                        res.json({
                            message: err,
                            code: 400,
                        })
                    }else{
                        res.json({
                            message: "User created",
                            code: 200,
                        })
                    }
                })
            })
        }
    }
})

app.post("/auth/login", async (req,res)=>{
    let username = req.body.username
    let password = req.body.password
    const user = await UserSchema.find({username})

    if(user.length===0){
        res.json({
            status: 400,
            message: "User doesn't exist!"
        })
    } else {
        let doMatch = bcrypt.compareSync(password, user[0].password)
        if(!doMatch){
            res.json({
                status: 400,
                message: "Invalid credentials!",
            })
        } else {
            res.json({
                status: 200,
                message: "Login success",
            })
        }
    }
})

app.post("/auth/forgotPassword", async (req,res)=>{
    let username = req.body.username
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    const user = await UserSchema.find({username})

    if(user.length===0){
        res.json({
            status: 400,
            message: "User doesn't exist!"
        })
    } else {
        if(password !== confirmPassword){
            res.json({
                status: 400,
                message: "Password mismatch!!"
            })
        } else{
            UserSchema.updateOne({password: user[0].password}, {$set: {password: confirmPassword}}, function(err, result){
                if(err){
                    console.log(err);
                    res.json({
                        message: err,
                        code: 400,
                    })
                } else {
                    res.json({
                        status: 200,
                        message: "Password changed",
                    })
                }
            })
        }
    }
})


//CARD ROUTES

app.get("/flexible/cards", async (req,res)=>{
    // const CardInstance = new Card();
    // CardInstance.getAllCards()
    //     .then((cardsFromDatabase)=>{
    //         res.json(cardsFromDatabase)
    //     }).catch((err)=>{
    //         res.json({message: err})
    //     })
    try{
        const cardsFromDatabase = await CardSchema.find();
        res.json(cardsFromDatabase)
    }catch(err){
        res.json({message: err})
    }
})

app.get("/flexible/cards/:location", async (req,res) => {
    let cardLocation = req.params.location;
    console.log(cardLocation);
    const filteredCard = await CardSchema.find({location: cardLocation})

    if(filteredCard.length>0){
        res.json(filteredCard[0]);
    }else{
        res.json({
            message: `Cannot find card with location ${cardLocation} !!`,
            code: 200,
        })
    }
})

app.post("/flexible/cards", (req,res)=>{
    if(true){
        let card = new CardSchema(req.body);
        card.save(function(err){
            if(err){
                console.log(err);
                res.json({
                    message: err,
                    code: 400,
                })
            }else{
                res.json({
                    message: "Card information added",
                    code: 200,
                }) 
            }
        })
    } else {
        res.json({
            message: "User is not authorized to insert data",
            code: 401,
        })
    }
})

app.put("/flexible/cards", async (req,res)=>{
    const cardOldLocation = "manali"
    const cardNewLocation = "Jari, Himachal Pradesh"
    const category = "farms"
    const filteredCard = await CardSchema.find({location: cardOldLocation, category: category})

    if(filteredCard.length===0){
        res.json({
            status: 400,
            message: "Card doesn't exist!"
        })
    } else {
        CardSchema.updateOne({location: filteredCard[0].location}, {$set: {location: cardNewLocation}}, function(err, result){
            if(err){
                console.log(err);
                res.json({
                    message: err,
                    code: 400,
                })
            } else {
                res.json({
                    status: 200,
                    message: `Card location changed to ${cardNewLocation} from ${cardOldLocation}`,
                })
            }
        })
    }
})

app.delete("/flexible/cards/:location", async (req,res)=>{
    const filteredCard = await CardSchema.find({ location: req.params.location });

    if(filteredCard.length===0){
        res.json({
            status: 400,
            message: "Card doesn't exist!"
        })
    } else {
        CardSchema.findOneAndRemove({ location: req.params.location }, function(err,result){
            if(err){
                console.log(err);
                res.json({
                    message: err,
                    code: 400,
                })
            } else {
                res.json({
                    status: 200,
                    message: `Card with location ${req.params.location} deleted`,
                })
            }
        })
    }
})


mongoose.connect(
    "mongodb+srv://admin:admin@cluster-0.sayd9.mongodb.net/airbnb_db?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true}
)
.then((res)=>{
    console.log("connected");
    app.listen(PORT)
})