const express=require("express");
const router=express.Router({mergeParams:true}); //mergeParams achy sa route pr a jaty
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");//import file listing
const Listing=require("../models/listing.js");//import file listing
const{validateReview,isLoggedIn}=require("../middleware.js");




//reviews(POST review ROUTE)
router.post("/",isLoggedIn,validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success","New Review created!");
res.redirect(`/listings/${listing._id}`)
}));


//delete review route
// delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//pull=delete
  await Review.findByIdAndDelete(reviewId);
 req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`);
}));


module.exports=router;

