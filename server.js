// Session Authentication Lecture:
// authentication implements a systesm where users can create an account with a username and password
// so they can only access data relevant to their account

// ============================================ import modules here! ============================================ // 
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session'); // perform actions related to user's route session
// const MongoStore = require("connect-mongo"); // store session data in MongoDB so you don't have to sign in everytime the server restarts!!
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js"); //


// integrate session management into app, configure middleware to securely manage user  sessions w/ secret key
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false, // dont resave sessions that havent changed
      saveUninitialized: true, // store new uninitialized sessions
    //   store: MongoStore.create({
    //     mongoUrl: process.env.MONGO_URI,
    //     }),
    })
  );

app.use(passUserToView); // add custom middleware after session middleware

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3004";

// import authController so we can use router object (after port const)
const authController = require("./controllers/auth.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

// ============================================ ROUTES ============================================ // 

// GET / homepage
app.get("/", async (req, res) => {
    res.render("index.ejs", { // send user variable to index.ejs, if user = undefined -> send user to sign up/in page, if user = value -> send to personalized welcome
        user: req.session.user,
    });
    // res.render("index.ejs");
  });
  

  // tell Express to use authController for handling requests that match /auth, define after home page route
app.use("/auth", authController);


// create route for the vip lounge
app.get("/vip", isSignedIn, (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}! We hope you brought refreshments.`);
    } else {
        res.send("Sorry, no guests allowed.");
    }
});








// put at the bottom or else muahahaha
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
