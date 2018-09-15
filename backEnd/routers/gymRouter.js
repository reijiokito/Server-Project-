const express = require('express');
const gymRouter = express.Router();
const GymModel = require("../models/gymModel");

gymRouter.get("/", (req, res) => {   //Show dia diem
    GymModel.find({})
    .populate('diadiem')
    .exec((err, places) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, places });
    })
    
});

gymRouter.get("/:gymID", (req, res) => {    //tim dia diem cu the
    GymModel.find({ _id: req.params.gymID })
    .populate('diadiem')
    .exec((err, place) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!place) res.status(401).send("Not Found!")
        else res.status(201).send({ success: 1, place });
    })
    
});

gymRouter.post("/", (req, res) => {          //them dia diem
    const { name, description, address, imgUrl, price, PT, diadiem } = req.body;
    GymModel.create({ name, description, address, imgUrl, price, PT, diadiem }, (err, gymCreated) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, gymCreated });
    })
});

gymRouter.put("/:gymID", (req, res) => { //cha bao gio dung
    const { name, description, address, imgUrl, price, PT, diadiem } = req.body;
    const updateInfo = { name, description, address, imgUrl, price, PT, diadiem };
    GymModel.findById({ _id: req.params.gymID }, (err, gymFound) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!gymFound) res.status(401).send({ success: 0, message: "Not Found" })
        else {
            for (let key in updateInfo) {
                if (updateInfo[key]) {
                    gymFound[key] = updateInfo[key]
                }
            }
            gymFound.save((err) => {
                if (err) res.status(500).send({ success: 0, err })
                else res.send({ success: 1, gymFound })
            })
        }
    })
})

gymRouter.delete("/:gymID", (req, res) => {
    GymModel.findByIdAndRemove({ _id: req.params.gymID }, (err, placeDeleted) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!placeDeleted) res.status(401).send({ success: 0, message: "Not Found!" })
        else res.send({ success: 1, message: "Delete successfully!" })
    })
})

module.exports = gymRouter;