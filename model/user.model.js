const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "Username is required",
        trim: true,
    },
    password: {
        type: String,
        required: "Password is required",
        trim: true,
    },
})

module.exports = mongoose.model("user", UserSchema);