const express = require('express');
const mongoose = require('mongoose');
const shopRouter = require('./router/ShopRouter');
const userRouter = require('./router/UserRouter');
const productRouter = require('./router/ProductRouter');
const orderRouter = require('./router/OrderRouter');
const authRouter = require('./router/authRouter');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
var FacebookStrategy = require('passport-facebook').Strategy;

const passport=require("passport")
const passportfb=require("passport-facebook").Strategy
const userModel = require("./model/userModel");
const domain =require("./config/domain")
let backend = express();

backend.use(passport.initialize());
backend.use(passport.session());


backend.use(cors());
backend.use(session({
    secret: 'Nguoi yeu dau hoi~ em mai la mat troiiii',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

backend.use(cors({
    credentials: true,
    origin: true
}))
backend.use(bodyParser.urlencoded({ extended: false }));
backend.use(bodyParser.json());
backend.use('/shop', shopRouter);
backend.use('/user', userRouter);
backend.use('/product', productRouter);
backend.use('/order', orderRouter);
backend.use('/auth', authRouter);
// backend.use('/auth/fb', authfbRouter);


backend.get("/auth/fb", passport.authenticate('facebook',{scope:['email']}));
// backend.get("/auth/fb/callback",passport.authenticate('facebook',{
//     failureRedirect:"https://localhost:3000",successRedirect:"https://localhost:3000"
// }))
backend.get('/logout', function(req, res, next){
    console.log('vao logout');
    req.logout();
    return res.send('logout ok');
});

backend.get('/auth/fb/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) {
            console.log('err tai auth/fb/callback');
            console.log(err);
            return next({
                'err' : err
            });
        }

        if (!user) {
            console.log('no user');
            return next({
                'err' : 'nouser'
            });
        }

        req.logIn(user, function(err) {
            if (err) {
                console.log('error in req login');
                return res.redirect('/');
            }
            return res.redirect('https://localhost:3000');
        });


    })(req, res, next);
});

// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    
            
    passport.use(new FacebookStrategy( {
        clientID:"452497568573549",
        clientSecret:"7562251f160675be7f3d6c1e129cd9dd",
        callbackURL:domain.domain+"/auth/fb/callback",
        profileFields:["email","displayName","gender","picture"],
        'enableProof': true
    },
    (accessToken,refreshToken,profile,done)=>{
        console.log(profile);
        return done(null, profile._json);
    }
        ));

// passport.use(new passportfb(
//     {
//         clientID:"452497568573549",
//         clientSecret:"7562251f160675be7f3d6c1e129cd9dd",
//         callbackURL:"http://localhost:8080/auth/fb/callback",
//         profileFields:["email","displayName","gender","picture"]
//     },
//     (accessToken,refreshToken,profile,done)=>{
//         console.log(profile);
//         userModel.findOne({facebookID:profile._json.id},(err,user)=>{
//             if(err) return done(err);
//             if(user) return done(null,user);
//             const neuUser=new userModel({
//                 facebookID:profile._json.id,
//                 name:profile._json.name,
//                 email:profile._json.email,
//                 avatarUrl:profile._json.picture.data.url,
//                 gender:profile._json.gender,
//             })
//             neuUser.save((err)=>{
//                 return done(null,user)
//             })
//         })
//     }
// ))


let host = 'mongodb://FoodyHoLa:Hola123@ds243212.mlab.com:43212/foodyhoalac';
// let host = 'mongodb://localhost/Project';
mongoose.connect(host, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("mongodb success!")
    }
});

//config https
var fs    = require('fs');
var https = require('https');
var options =
 {
   key:  fs.readFileSync('./privkey.pem'),
   cert: fs.readFileSync('./fullchain.pem')
 };

 var server = https.createServer(options, backend);

 server.listen(process.env.PORT || 8080, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("Server is listening with localhost 8080");
    }
})
passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser((id,done)=>{
    userModel.findOne({facebookID:id},(err,user)=>{
        done(null,user);
    })
})