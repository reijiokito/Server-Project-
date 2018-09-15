const express = require('express');
const diadiemRouter = express.Router();
const DiaDiemModel = require("../models/diadiemModel");

diadiemRouter.get("/", (req, res) => {   //Show dia diem
    DiaDiemModel.find({}, (err, places) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, places });
    })
});

diadiemRouter.get("/:diadiemID", (req, res) => {    //tim dia diem cu the
    DiaDiemModel.find({ _id: req.params.diadiemID }, (err, place) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!place) res.status(401).send("Not Found!")
        else res.status(201).send({ success: 1, place });
    })
});

diadiemRouter.post("/", (req, res) => {          //them dia diem
    const { name, imgUrl } = req.body;
    DiaDiemModel.create({ name, imgUrl }, (err, placeCreated) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, placeCreated });
    })
});

diadiemRouter.put("/:diadiemID", (req, res) => { //cha bao gio dung
    const { name, imgUrl } = req.body;
    const updatePlaceInfo = { name, imgUrl };
    DiaDiemModel.findById({ _id: req.params.diadiemID }, (err, placeFound) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!placeFound) res.status(401).send({ success: 0, message: "Not Found" })
        else {
            for (let key in updatePlaceInfo) {
                if (updatePlaceInfo[key]) {
                    placeFound[key] = updatePlaceInfo[key]
                }
            }
            placeFound.save((err) => {
                if (err) res.status(500).send({ success: 0, err })
                else res.send({ success: 1, placeFound })
            })
        }
    })
})

diadiemRouter.delete("/:diadiemID", (req,res) => {
    DiaDiemModel.findByIdAndRemove({ _id: req.params.diadiemID }, (err, placeDeleted) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!placeDeleted) res.status(401).send({ success: 0, message: "Not Found!" })
        else res.send({ success: 1, message: "Delete successfully!" })
    })    
})

module.exports = diadiemRouter;