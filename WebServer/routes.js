const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

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
        console.log(response.data);
        res.json(response.data);
    } catch (err) {
        console.error(err);
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
        console.log(response);
        console.log(response.data);
        res.json(response.data);
    } catch (err) {
        console.log(err);
        if (err.statuscode == 401) {
            console.log("401 sent");
            res.status(401).json({ error: "Wrong Username or Password" });
        } else {
            console.error(err);
            res.status(500).json({ error: "An error occurred" });
        }
    }
});
router.post("/auth/deleteAccount", async (req, res) => {
    try {
        const username = req.query.username;
        console.log(username);
        const response = await axios.post(
            `${auth_service_url}/deleteAccount`,
            null,
            {
                params: {
                    username,
                },
            }
        );
        console.log(response.data);
        res.json(response.data);
    } catch (err) {
        console.error(err);
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
        console.log(response.data);
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});

//Data Routes
let data_service_url = process.env.DATA_SERVICE;
router.post("/data/createItem", async (req, res) => {
    try {
        const { authorization } = req.headers; // Extract the JWT token from the request header
        const data = req.body;
        console.log(authorization);
        console.log(data);
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

        res.json(response.data); // Send the response from the other server back to the client
    } catch (error) {
        console.error(error);
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
        console.log(response.data);
        res.send(response.data);
    } catch (error) {
        console.error(error);
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
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;
