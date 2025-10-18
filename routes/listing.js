const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); //import file listing
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const{validateListing}=require("../middleware.js");
const express = require("express");
const router = express.Router();
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

const listingController=require("../controllers/listings.js");

router.route("/")
.get( wrapAsync(listingController.index))
.post(

  isLoggedIn,
  
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);


//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(

  wrapAsync(listingController.showListing)
)
.put(

  isLoggedIn,
  isOwner,
    
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);



// //index route
// router.get("/", wrapAsync(listingController.index));
//new route
// router.get("/new", isLoggedIn,listingController.renderNewForm);
//show route
// router.get(
//   "/:id",
//   wrapAsync(listingController.showListing)
// );
// //create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.updateListing)
// );
//delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

module.exports = router;
