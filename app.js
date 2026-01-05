const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError=require("./utils/ExpressError.js"); // error handling if throws some status code
const app = express();
const port = 4500;
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const session=require("express-session");
const flash=require("connect-flash");

// ------------------ Middleware ------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public"))); // serve static files
app.use(methodOverride("_method")); // allow PUT/DELETE in forms
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.json()); // parse JSON

// ------------------ MongoDB ------------------
mongoose.connect("mongodb://mongo:27017/wanderlust?authSource=admin")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

app.get("/",(req,res)=>{
    res.send("hey iam root");
  })


  //sessions middleware
const sessionOptions={
  secret:"mysecretcode",
  resave:false,
  saveuninitialized:true,
  cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
}
app.use(session(sessionOptions));

//connect flash
app.use(flash());

//flash middleware

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listings);
app.use("/listings/:_id/reviews",reviews);


//validation error
app.use((req,res,next)=>{
  next(new ExpressError(404,"page not found"))
});

//error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error",{err});
});


// Start server
app.listen(port, () => console.log(`App is running on ${port}`));
