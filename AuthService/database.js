const bcrypt = require("bcrypt");

// //mongoDb connection
require("dotenv").config();
const mongoose = require("mongoose");
let uri;

uri = process.env.MONGO_URI;

mongoose
    .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log(err));

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
