const mongoose = require("mongoose");

//schema calls
const commentSchema = require("./comment");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },

    comments: [commentSchema],
});
