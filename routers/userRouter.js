const express = require('express');
const userRouter = express.Router();
const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt-nodejs');

userRouter.get("/", (req, res) => {
    UserModel.find({}, (err, users) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, users })
    })
});

userRouter.get("/:userID", (req, res) => {
    UserModel.findById({ _id: req.params.userID })
    .populate('chosenPT')
    .populate('gymJoin')
    .exec((err, userFound) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!userFound) res.status(401).send({ success: 0, message: "Not found!" })
        else res.status(201).send({ success: 1, userFound })
    })
});

userRouter.post("/", (req, res) => {
    
    const { username,name, email, sdt, password, gymJoin, chosenPT } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashpass = bcrypt.hashSync(password, salt);
    UserModel.create({ username,name, email, sdt, hashpass, gymJoin, chosenPT }, (err, userCreated) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, userCreated });
    });            
});


userRouter.put("/:userID", async (req, res) => {    
    console.log(req.body);
    try {
        const user = await UserModel.findById(req.params.userID);        
        if (!user) res.status(404).send({ success: 0, errMsg: "Not Founded" });
        else {            
            if (req.body.gymJoin) user.gymJoin = req.body.gymJoin;
            
            if (req.body.chosenPT) user.chosenPT = req.body.chosenPT;
        }
        const userUpdated = await user.save();

        res.json({ mesage: "User updated!",userUpdated });
    } catch (error) {
        res.json({ errMsg: "Error Update" });
    }
});

userRouter.delete("/:userID", (req, res) => {
    UserModel.findByIdAndRemove({ _id: req.params.userID }, (err, userDeleted) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!userDeleted) res.status(401).send({ success: 0, message: "Not Found!" })
        else res.send({ success: 1, message: "Delete successfully!" })
    })
})

module.exports = userRouter;