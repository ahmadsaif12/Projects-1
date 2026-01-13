const Listing=require("../models/listing.js")
module.exports.index=async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings })};

module.exports.createListing=async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings")};

module.exports.editListing=async (req, res) => {
  const listing = await Listing.findById(req.params._id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing=async (req, res) => {
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
}

module.exports.destroyListing=async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params._id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}