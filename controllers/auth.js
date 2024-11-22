// create controllers directory to separate authentication routes from other models that create/manage resources
// mkdir controllers & touch controllers/auth.js
// similar to normal route set-up but app object is replaced with router

// import user model into auth.js
const User = require("../models/user.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // hashing library which scrambles user's pw into nonsense string thats hard to decrypt

module.exports = router;

// import authController in server.js file so we can use router object in main app

// ======================================================= ROUTES 
// full url to access sign-up page is: localhost:3004/auth/sign-up
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });


// create route to submit information on sign up form
router.post("/sign-up", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body. username }); // user validation: check database for any existing user with chosen username
    if (userInDatabase) {
        return res.send("Username already taken.")
    };
    if (req.body.password !== req.body.confirmPassword) { // password validation
        return res.send("Password and Confirm Password must match!");
    };
    const hashedPassword = bcrypt.hashSync(req.body.password, 10); // 10 = amount of salting, higher number means harder to decrypt pw and longer to check
    req.body.password = hashedPassword;
    const user = await User.create(req.body); // create new user after going thru the rest of the validations
    // allow user to sign in immediately upon signing up
    req.session.user = {
        username: user.username,
      };
      
      req.session.save(() => {
        res.redirect("/");
      });
      
    res.send(`Your account has been created ${user.username}!`);
});


// add route to render sign in form
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

// add route to handle sign in request
router.post("/sign-in", async (req,res) => {
    const userInDatabase = await User.findOne({ username: req.body.username}); // look for username in database
    if (!userInDatabase) { // if username doesn't exist, send failed message
        return res.send("Login request failed. Please try again.")
    };
    const validPassword = bcrypt.compareSync( // hash entered pw and compare it to pw in database
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) { // if its not the same, send failure message
        return res.send("Login failed. Please try again.")
    };
    // once we have a user with the correct password, make a session!
    // can store other data like userId in session as well
    req.session.user = { // attach session object to all incoming requests aka set user retrieved from database as user in newly created session
        username: userInDatabase.username,
        _id: userInDatabase._id,
    };
    // req.session.save(() => { // modify controller so landing page has time to update
    //     res.redirect("/");
    //   });
    // res.send("Sign in request received!");
    res.redirect("/"); // take us back to our landing page
});

// GET request to /auth/sign-out for signout page
router.get("/sign-out", (req, res) => {
    // res.send("The user would like 2 be taken out!");
    // avoid race condition so redirect doesnt finish before session has had time to  update
    req.session.destroy(); // get rid of the session attached to the req object
    res.redirect("/"); // redirect back to landing page after signed out
});