const express = require("express");
const router = express.Router();
const axios = require("axios");
let passport = require("passport");
require("dotenv").config();
const itemDB = require("./database");
const auth = require("./auth");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

router.post(
    "/createItem",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        try {
            const { DeviceName, DeviceType, Manufacturer } = req.body;
            const username = req.user.username;
            // console.log(req.user);
            // console.log(DeviceName, DeviceType, Manufacturer);
            // console.log(req.body);
            const newItem = new itemDB({
                username,
                DeviceName,
                DeviceType,
                Manufacturer,
            });

            newItem
                .save() //password is saved after encryption
                .then(logger.info("Item Created"), res.send("Item Created"))
                .catch((err) => logger.error(err), res.status(400).err);
        } catch (error) {
            logger.error(error);
            res.status(500).json({ statuscode: 500, msg: error.toString() });
        }
    }
);

router.get(
    "/getItems",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        try {
            const username = req.user.username;
            itemDB.find({ username: username }).then((items) => {
                logger.info("Items retrieved");
                res.status(200).json(items);
            });
        } catch (error) {
            logger.error(error);
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
                if (item == null) {
                    logger.info("Item not found");
                    res.status(400).json({
                        statuscode: 400,
                        msg: "Item not found",
                    });
                }
                logger.info({ msg: "Item Deleted", item });
                res.status(200).json({ msg: "Item Deleted", item });
            });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ statuscode: 500, msg: error.toString() });
        }
    }
);

module.exports = router;
