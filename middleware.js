const Listing=require("./models/listing.js")
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const ExpressError=require("./utils/ExpressError.js")
module.exports.Isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must log in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session && req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isowner=async(req,res,next)=>{
  let {_id}=req.params;
  let listing=await Listing.findById(_id);
    if(!listing.owner._id.equals(res.locals.currentUser._id )){
      req.flash("error","you don't have permissions to perform actions here")
      return res.redirect(`/listings/${_id}`);
    }
    next();
}

//validation middleware listings
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

//validation reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  
  if (error) {
    let errMsg = error.details.map(el => el.message).join(" , ");
    throw new ExpressError(404, errMsg);
  }

  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review || !review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect("back");
  }
  next();
};
