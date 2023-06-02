const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const logger = require("./logger");

//Auth Routes
let auth_service_url = process.env.AUTH_SERVICE;
router.post("/auth/createAccount", async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await axios.post(
            `${auth_service_url}/createAccount`,
            null,
            {
                params: {
                    username,
                    password,
                },
            }
        );
        logger.info("Account Creation Request Sent");
        res.json(response.data);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const response = await axios.post(`${auth_service_url}/login`, null, {
            params: {
                username,
                password,
            },
        });
        logger.info(`${username} login request sent`);
        res.json(response.data);
    } catch (err) {
        console.log(err);
        if (err.statuscode == 401) {
            logger.info("401 sent");
            res.status(401).json({ error: "Wrong Username or Password" });
        } else {
            logger.error(err);
            res.status(500).json({ error: "An error occurred" });
        }
    }
});
router.post("/auth/deleteAccount", async (req, res) => {
    try {
        const username = req.query.username;
        const response = await axios.post(
            `${auth_service_url}/deleteAccount`,
            null,
            {
                params: {
                    username,
                },
            }
        );
        logger.info(`${username} Account Deletion request sent`);
        res.json(response.data);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});
router.post("/auth/updatePassword", async (req, res) => {
    try {
        const { username, oldpassword, newpassword } = req.query;
        const response = await axios.post(
            `${auth_service_url}/updatePassword`,
            null,
            {
                params: {
                    username,
                    oldpassword,
                    newpassword,
                },
            }
        );
        logger.info(`${username} Password update request sent`);
        res.json(response.data);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});

//Data Routes
let data_service_url = process.env.DATA_SERVICE;
router.post("/data/createItem", async (req, res) => {
    try {
        const { authorization } = req.headers; // Extract the JWT token from the request header
        const data = req.body;
        // Forward the data to another server using Axios
        const response = await axios.post(
            `${data_service_url}/createItem`,
            data,
            {
                headers: {
                    Authorization: authorization, // Include the JWT token in the request header
                },
            }
        );
        logger.info("Item Creation Request Sent");
        res.json(response.data); // Send the response from the other server back to the client
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

router.get("/data/getItems", async (req, res) => {
    try {
        const { authorization } = req.headers; // Extract the JWT token from the request header

        const response = await axios.get(`${data_service_url}/getItems`, {
            headers: {
                Authorization: authorization, // Include the JWT token in the request header
            },
        });
        logger.info("Item Retrieval Request Sent");
        res.send(response.data);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/data/deleteItem", async (req, res) => {
    try {
        const { authorization } = req.headers; // Extract the JWT token from the request header
        const data = req.body;
        
        const response = await axios.post(
            `${data_service_url}/deleteItem`,
            data,
            {
                headers: {
                    Authorization: authorization, // Include the JWT token in the request header
                },
            }
        );
        logger.info("Item Deletion Request Sent");
        res.send(response.data);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;
