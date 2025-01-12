const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;

    