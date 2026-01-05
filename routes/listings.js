const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

//middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};


// GET all listings
router.get("/", WrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
}));

// GET new listing form
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE a new listing
router.post("/", validateListing, WrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}));

// GET single listing by ID
router.get("/:_id", WrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params._id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

// GET edit form
router.get("/:_id/edit", WrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params._id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// UPDATE a listing
router.put("/:_id", validateListing, WrapAsync(async (req, res) => {
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
router.delete("/:_id", WrapAsync(async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params._id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}));

module.exports = router;
