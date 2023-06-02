var express = require("express");
require("dotenv").config();
let passport = require("passport");
//var user = require("./database");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const logger = require("./logger");

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
