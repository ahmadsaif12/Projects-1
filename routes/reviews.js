const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}  =require("../schema.js");
const Listing=require("../models/listing.js");
const Review = require("../models/review.js");
const WrapAsync=require("../utils/WrapAsync.js");  
const ExpressError=require("../utils/ExpressError.js");

// validate reviews
 const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  
  if (error) {
    let errMsg = error.details.map(el => el.message).join(" , ");
    throw new ExpressError(404, errMsg);
  }

  next();
};

//review create
router.post(
  "/",
  validateReview,
  WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params._id);
    const newReview = new Review(req.body.review);
    await newReview.save();           // save first
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "New review created!");

    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review
router.delete("/:reviewId",WrapAsync(async(req,res)=>{
  let{_id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(_id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review Deleted");
  res.redirect(`/listings/${_id}`);

}))
module.exports=router;