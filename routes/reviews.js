const express = require("express");
const router = express.Router({ mergeParams: true });
// const Listing = require("../models/listing");
const Review = require("../models/review");
const WrapAsync = require("../utils/WrapAsync");
const { validateReview, Isloggedin, isReviewAuthor } = require("../middleware");
const ReviewController=require("../controllers/review.js");

router.post(
  "/",
  Isloggedin,
  validateReview,
  WrapAsync(ReviewController.createReview)
);

router.delete(
  "/:reviewId",
  Isloggedin,isReviewAuthor,
  WrapAsync(ReviewController.destroyReview)
);

module.exports = router;
