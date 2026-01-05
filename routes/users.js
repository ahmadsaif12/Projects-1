const express = require("express");
const router = express.Router(); 
const User=require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup",WrapAsync(async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new User({email,username})
    const registeruser=await User.register(newuser,password);
    console.log(registeruser);
    req.flash("success","welcome to listings websiter");
    res.redirect("/listings");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings"); 
  }
);
module.exports = router;
