
const User=require("../models/user.js")

module.exports.SignupUser=async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash("success", "Welcome to listings website");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

module.exports.renderSignupform=(req, res) => {
  res.render("users/signup.ejs");
}

module.exports.loginRender=(req, res) => {
  res.render("users/login.ejs");
}
module.exports.login=(req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.logout=(req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "You logout successfully!");
    res.redirect("/listings");
  });
}