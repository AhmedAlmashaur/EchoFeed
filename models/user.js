const mongoose = require("mongoose");

//schema calls
const postSchema = require("./post");
const bookmarkSchema = require("./bookmark");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    pfp: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fdownload-blank-default-pfp-wallpaper--757308493613040301%2F&psig=AOvVaw09chTnwvlNmz7v1SZcGZRU&ust=1736781969623000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDk85S_8IoDFQAAAAAdAAAAABAE"
    },

    
    posts: [postSchema],
    
    bookmarks: [bookmarkSchema],
});

const User = mongoose.model("User", userSchema);



module.exports = User;
