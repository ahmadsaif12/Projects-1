const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {Isloggedin, isowner,validateListing} =require("../middleware.js");


// GET all listings
router.get("/", WrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
}));

// GET new listing form
router.get("/new", Isloggedin,(req, res) => {
  res.render("listings/new.ejs");
});

// CREATE a new listing
router.post("/", Isloggedin,validateListing, WrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}));

// GET single listing by ID
router.get("/:_id", WrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params._id)
  .populate({
    path: "reviews",
    populate: { path: "author" } 
  })
  .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

// GET edit form
router.get("/:_id/edit",Isloggedin, WrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params._id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// UPDATE a listing
router.put("/:_id",isowner, Isloggedin,validateListing, WrapAsync(async (req, res) => {
  const updatedListing = await Listing.findByIdAndUpdate(
    req.params._id,
    req.body.listing,
    { new: true, runValidators: true }
  );
  if (!updatedListing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${req.params._id}`);
}));

// DELETE a listing
router.delete("/:_id",isowner,Isloggedin, WrapAsync(async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params._id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}));

module.exports = router;
