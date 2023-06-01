// //mongoDb connection
require("dotenv").config();
const mongoose = require("mongoose");
let uri;

uri = process.env.MONGO_URI;

mongoose
    .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log(err));

const itemSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    DeviceName: {
        type: String,
        required: true,
    },
    DeviceType: {
        type: String,
        enum: {
            values: ["Light", "Socket", "Doorbell", "Button"],
            message: "{VALUE} is not a valid choice",
        },
    },
    Manufacturer: {
        type: String,
        required: false,
    },
});
const itemDB = mongoose.model("itemDB", itemSchema);
module.exports = itemDB;
