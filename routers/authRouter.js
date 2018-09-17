const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const authRouter = express.Router();
// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;

const UserModel = require('../models/userModel');

// authRouter.use(passport.initialize());
// authRouter.use(passport.session());

// authRouter.route('/login')
//         .post(passport.authenticate('local',{failureRedirect : '/login',successRedirect:'/login'}));

// passport.use(new localStrategy(
//     (username, password, done) =>{
//         if (!username || !password) {
//             res.status(400).send({ success: 0, message: "Redo pls" })
//         } else {
//             UserModel.findOne({ username })
//                 .then(UserFound => {
//                     if (!username) res.status(400).send({ success: 0, message: "Not found!" })
//                     else {
//                         const compare = bcrypt.compareSync(password, UserFound.password);
//                         if (compare) {
                            
//                             done(null, UserFound);
//                         } else {
//                             done(null,false);
//                         }
//                     }
//                 })
//                 .catch(error => res.status(500).send({ success: 0, error }));
//         }
//     }
// ));

// passport.serializeUser((user, done)=>{
//     done(null,user);
// });

// passport.deserializeUser((user,done)=>{
//     const username = user.username;
//     const password = user.password;
//     if (!username || !password) {
//         res.status(400).send({ success: 0, message: "Redo pls" })
//     } else {
//         UserModel.findOne({ username })
//             .then(UserFound => {
//                 if (!username) res.status(400).send({ success: 0, message: "Not found!" })
//                 else {
//                     const compare = bcrypt.compareSync(password, UserFound.password);
//                     if (compare) {
                        
//                         done(null,UserFound);
//                     } else {
//                         done(null,false);
//                     }
//                 }
//             })
//             .catch(error => res.status(500).send({ success: 0, error }));
//     }
// });


authRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send({ success: 0, message: "Redo pls" })
    } else {
        UserModel.findOne({ username })        
            .then(UserFound => {
                if (!username) res.status(400).send({ success: 0, message: "Not found!" })
                else {
                    const compare = bcrypt.compareSync(password, UserFound.hashpass);
                    if (compare) {                        
                        req.session.user = UserFound;
                        res.send({ success: 1, message: "Login",user: UserFound });
                    } else {
                        res.status(401).send({ success: 0, message: "Unauthorized" });
                    }
                }
            })
            .catch(error => res.status(500).send({ success: 0, error }));
    }
});

authRouter.get('/isLogin',(req,res)=>{
    if(req.session.user)
        res.send({success:1,user:req.session.user});
    else
        res.send({success:0});
});

authRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).send({ success: 0, err })
        else res.send({ success: 1, message: "Logout" });
    })
});

module.exports = authRouter;