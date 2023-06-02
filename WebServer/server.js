const express = require("express");
const app = express();
require("dotenv").config();
const logger = require("./logger");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes to other servers route file
let router = require("./routes");

app.use("/", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, logger.info("Server has started at port " + PORT));
