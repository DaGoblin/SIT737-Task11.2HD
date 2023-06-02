const express = require("express");
require("dotenv").config();
const app = express();
const passport = require("passport");
const User = require("./database");
const auth = require("./auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("./logger");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const jwtSecret = process.env.JWTSECRET;
const saltRounds = 10;
//Auth APi Routes
app.post("/login", function (req, res, next) {
    
    passport.authenticate(
        "local",
        { session: false },
        (err, username, info) => {
            if (err || !username) {
                if (err == "Wrong Username" || err == "Wrong password") {
                    logger.error("Wrong Username or Password");
                    return res.status(401);
                } else {
                    logger.error({
                        message: "Unknown Error",
                        username: username,
                        info: info,
                    });
                    return res.status(400).json({
                        message: "Unknown Error",
                        username: username,
                        info: info,
                    });
                }
            }
            req.login(username, { session: false }, (err) => {
                if (err) {
                    logger.error({
                        message: "Unknown Error",
                        info: err,
                    });
                    res.send(err);
                }
                // generate a signed json web token with the contents of user object and return it in the response
                const token = jwt.sign(username, jwtSecret);
                logger.info(`${username.username} logged in`);
                return res.json({ token });
            });
        }
    )(req, res);
});

app.get("/", (req, res) => {
    res.send("Auth Microservice");
});

app.get("/loggedin", (req, res) => {
    res.send("logged in");
});

app.get(
    "/JWTDetails",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.send(req.user);
    }
);

app.post("/createAccount", (req, res) => {
    try {
        const username = req.query.username;
        const password = req.query.password;

        User.findOne({ username: username }).then((user) => {
            if (user) {
                logger.error(`${user} user already exists`);
                res.send("user already exists");
            } else {
                //Validation
                // if the email does not exist, it saves the users input to a variable "newUser"
                const newUser = new User({
                    username,
                    password,
                });
                //Password Hashing
                //This encrypts the password with bcrypt

                bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                    //if (err) throw err;

                    newUser.password = hash;
                    newUser
                        .save() //password is saved after encryption
                        .then(
                            logger.info(`${username} User Created`),
                            res.send(`${username} User Created`)
                        )
                        .catch((err) => logger.error(err), res.status(400).err);
                });
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.post("/deleteAccount", (req, res) => {
    try {
        const username = req.query.username;
        

        User.deleteOne({ username: username }).then((user) => {
            if (user.deletedCount == 0) {
                logger.error(`${username} not found`);
                res.send(`${username} not found`);
            } else {
                logger.info(`${username} Deleted`);
                res.send(`${username} Deleted`);
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.post("/updatePassword", async (req, res) => {
    try {
        const username = req.query.username;
        const oldPassword = req.query.oldpassword;
        const newPassword = req.query.newpassword;
        
        let returnedUser = await User.findOne({ username: username }); //find users in Mongo DB
        if (!returnedUser) {
            logger.info(`${username} not found`);
            res.send(`${username} not found`);
        }

        await bcrypt.compare(
            oldPassword,
            returnedUser.password,
            async function (err, result) {
                if (result) {
                    returnedUser.password = await bcrypt.hash(
                        newPassword,
                        saltRounds
                    );
                    await returnedUser.save();
                    logger.info(`${username} Password Updated`);
                    res.send(`${username} Password Updated`);
                } else {
                    logger.info("Wrong password");
                    res.send("Wrong password");
                }
            }
        );
    } catch (error) {
        logger.error(error);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

const PORT = process.env.PORT || 4000;

var server = app.listen(
    PORT,
    logger.info("Server has started at port " + PORT)
);

module.exports = {
    server: server,
};
