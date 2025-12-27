const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});

  // Define the 6 Central Asian countries
  const countries = [
    "Azerbaijan",
    "Kazakhstan",
    "Kyrgyzstan",
    "Tajikistan",
    "Turkmenistan",
    "Uzbekistan",
  ];

  // Group listings by country
  const listingsByCountry = {};
  countries.forEach((country) => {
    listingsByCountry[country] = [];
  });

  // Organize listings into their respective country folders
  allListings.forEach((listing) => {
    const country = listing.country;
    if (listingsByCountry[country]) {
      listingsByCountry[country].push(listing);
    }
  });

  res.render("listings/index.ejs", {
    listingsByCountry,
    countries,
    allListings,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exixted");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// module.exports.createListing=async (req, res, next) => {
//   let result = listingSchema.validate(req.body);
//   console.log(result);
//   if (result.error) {
//     throw new ExpressError(400, result.error);
//   }

//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;

//   await newListing.save();
//   req.flash("success", "New listing created!");
//   res.redirect("/listings");
// }

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    const { path: url, filename } = req.file;
    newListing.image = { url, filename };
  } else if (!newListing.image || !newListing.image.url) {
    // Fallback keeps missing uploads from breaking the UI
    newListing.image = {
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage",
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exixted");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings/");
};
