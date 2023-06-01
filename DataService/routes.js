const express = require("express");
const router = express.Router();
const axios = require("axios");
let passport = require("passport");
require("dotenv").config();
const itemDB = require("./database");
const auth = require("./auth");
const jwt = require("jsonwebtoken");

router.post(
    "/createItem",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        try {
            const { DeviceName, DeviceType, Manufacturer } = req.body;
            const username = req.user.username;
            console.log(req.user);
            console.log(DeviceName, DeviceType, Manufacturer);
            console.log(req.body);
            const newItem = new itemDB({
                username,
                DeviceName,
                DeviceType,
                Manufacturer,
            });

            newItem
                .save() //password is saved after encryption
                .then(res.send("User Created"))
                .catch((err) => console.log(err), res.status(400).err);
        } catch (error) {
            console.error(error);
            res.status(500).json({ statuscode: 500, msg: error.toString() });
        }
    }
);

router.get(
    "/getItems/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        try {
            const username = req.user.username;
            itemDB.find({ username: username }).then((items) => {
                res.status(200).json(items);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ statuscode: 500, msg: error.toString() });
        }
    }
);

router.post(
    "/deleteItem",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        try {
            const username = req.user.username;
            console.log(req.body.id);
            itemDB.findByIdAndDelete(req.body.id).then((item) => {
               
                res.status(200).json(item);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ statuscode: 500, msg: error.toString() });
        }
    }
);

module.exports = router;
