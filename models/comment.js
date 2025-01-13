const mongoose = require("mongoose");

//Schema for comments
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
});

