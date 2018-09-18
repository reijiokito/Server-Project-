const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');



const apiRouter = require('./routers/apiRouter');

let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors({ origin: ['http://localhost:8080','http://localhost:3000', 'https://gymmover.herokuapp.com'], credentials: true }));

app.use(session({
    secret: "Secret",
    resave: false,
    saveUninitialized: false,
    cookie:{secure:false, maxAge: 7*24*60*60*1000,httpOnly:false}  //minisecond
}));

app.use("/api",apiRouter);








mongoose.connect("mongodb://localhost:27017/Gym",{ useNewUrlParser: true }, (err) => {
    if(err) console.log(err);
    else console.log("DB connect success!");
});

const port = process.env.PORT || 8080;
app.listen(port, function(err){
    if(err) console.log(err);
    else console.log(`Server is running at port: ${port}`);
});