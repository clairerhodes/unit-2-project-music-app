// models/song.js
const mongoose = require("mongoose"); // require mongo

// define schema for song
const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    link: String, // this is where user inserts the link they want to upload
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // reference User
    }
});

// link schema to a model to connect defined structure to our database
const Song = mongoose.model("Song", songSchema);

// export model to use throughout app
module.exports = Song;

// import model into server.js file