var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var user = require("./database");
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(
    new LocalStrategy(function verify(username, password, done) {
        user.findOne({ username: username }) //find users in Mongo DB
            .then((User) => {
                if (!User) {
                    console.log("Wrong Username");
                    return done("Wrong Username");
                }

                bcrypt.compare(password, User.password, function (err, result) {
                    if (result) {
                        let userDetails = {
                            id: User.id,
                            username: User.username,
                        };
                        return done(null, userDetails);
                    } else {
                        console.log("Wrong password");
                        return done("Wrong password");
                    }
                });
            })
            .catch((error) => console.log(error));
    })
);

const jwtSecret = process.env.JWTSECRET;

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        },
        function (jwtPayload, cb) {
            let userDetails = {
                id: jwtPayload.id,
                username: jwtPayload.username,
            };
            return cb(null, userDetails);
        }
    )
);
