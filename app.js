const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");

const app = express();
const port = 4500;

// EJS mate
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Method override
app.use(methodOverride("_method"));

// Forms
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongo_url = "mongodb://mongo:27017/wanderlust";

mongoose.connect(mongo_url)
  .then(() => {
    console.log("MongoDB connected");

    // Start Express server only after MongoDB is connected
    app.listen(port, () => {
      console.log(`App is running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Routes

app.get("/listings", async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings", async (req, res) => {
  const newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
});

app.get("/listings/:_id", async (req, res) => {
  const { _id } = req.params;
  const listing = await Listing.findById(_id);
  res.render("listings/show.ejs", { listing });
});

app.get("/listings/:_id/edit", async (req, res) => {
  const { _id } = req.params;
  const listing = await Listing.findById(_id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:_id", async (req, res) => {
  const { _id } = req.params;
  await Listing.findByIdAndUpdate(_id, { ...req.body.listing });
  res.redirect("/listings");
});

app.delete("/listings/:_id", async (req, res) => {
  const { _id } = req.params;
  await Listing.findByIdAndDelete(_id);
  res.redirect("/listings");
});
