const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { Isloggedin, isowner, validateListing } = require("../middleware.js");
const Listingcontroller = require("../controllers/listing.js");

// INDEX + CREATE
router
  .route("/")
  .get(WrapAsync(Listingcontroller.index))
  .post(Isloggedin, validateListing, WrapAsync(Listingcontroller.createListing));

// NEW listing form
router.get("/new", Isloggedin, (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW single listing
router.get("/:_id", WrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params._id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
}));

// EDIT form
router.get(
  "/:_id/edit",
  Isloggedin,
  isowner,
  WrapAsync(Listingcontroller.editListing)
);

// UPDATE
router.put(
  "/:_id",
  Isloggedin,
  isowner,
  validateListing,
  WrapAsync(Listingcontroller.updateListing)
);

// DELETE
router.delete(
  "/:_id",
  Isloggedin,
  isowner,
  WrapAsync(Listingcontroller.destroyListing)
);

module.exports = router;
