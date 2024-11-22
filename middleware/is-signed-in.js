const isSignedIn = (req, res, next) => {
    if (req.session.user) return next(); // check if user is logged in and if so, then continue with functionality
    res.redirect("/auth/sign-in"); //redirect to sign in page if user is not logged in
  };
  
  module.exports = isSignedIn;
  