const mongoose = require("mongoose")

const CardSchema = new mongoose.Schema({
    url: {
        type: String,
        required: "URL is required",
        trim: true,
    },
    location: {
        type: String,
        required: "Location is required",
        trim: true,
    },
    price: {
        type: String,
        required: "Price is required",
        trim: true,
    },
    distance: {
        type: String,
        required: "Distance is required",
        trim: true,
    },
    date: {
        type: String,
        required: "Date is required",
        trim: true,
    },
    category: {
        type: String,
        required: "Category is required",
        trim: true,
    },
})

module.exports = mongoose.model("card", CardSchema);