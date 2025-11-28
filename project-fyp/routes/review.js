const express=require("express");
const router=express.Router({mergeParams:true}); //mergeParams achy sa route pr a jaty
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");//import file listing
const Listing=require("../models/listing.js");//import file listing
const{validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");


const reviewController=require("../controllers/reviews.js")

//reviews(POST review ROUTE)
router.post("/",isLoggedIn,validateReview,wrapAsync( reviewController.createReview));


//delete review route
// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports=router;

