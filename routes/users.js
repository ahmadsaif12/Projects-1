const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController=require("../controllers/users.js")

router
.route("/signup")
.get(UserController.renderSignupform)
.post(WrapAsync(UserController.SignupUser));


router
.route("/login")
.get( UserController.loginRender)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),UserController.login
)
  

router.get("/logout", UserController.logout);

module.exports = router;
