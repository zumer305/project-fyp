// require express 
const express= require("express");
const app=express();

// require mongoose
const mongoose= require("mongoose");

const Listing=require("./models/listing.js");//import file listing
const Review=require("./models/review.js");//import file listing

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

//path
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // let{id}=req.params;

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));

// errors 
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


const {listingSchema,reviewSchema}=require("./schema.js");

app.listen(8080,()=>{
    console.log("app is listening to the port 8080");
});
app.get("/",(req,res)=>{
    res.send("This is root");//print,res.render(file),res.redirect(link)
});


const url='mongodb://127.0.0.1:27017/wanderlust';
main()
.then(()=>{
    console.log("connect to mongodb");
})
.catch((err)=>{
    console.log(err);
});
async function main(){ //async(wait) , sync(linewise)
    await mongoose.connect(url);
}


//testListing
// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"calengute,Goa",
//         country:"India",
//     });
//      await sampleListing.save();
//      console.log("sample is saved");
//      res.send("success");

// });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



//index route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
   
});
//new route
app.get("/listings/new",async(req,res)=>{
   res.render("listings/new.ejs");

});
//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}));
//create route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
// if(!req.body.listing){
//     throw new ExpressError(400,"Send valid data for listing");
// }

    const newListing=new Listing(req.body.listing);
//         if(!newListing.title){
//     throw new ExpressError(400,"Title is missing");
// }
//     if(!newListing.description){
//     throw new ExpressError(400,"Description is missing");
// }
//     if(!newListing.location){
//     throw new ExpressError(400,"Location is missing");
// }
//     if(!newListing.country){
//     throw new ExpressError(400,"Country is missing");
// }
 await newListing.save();
 res.redirect("/listings");

}));
//edit route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));
//update route
app.put("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
res.redirect("/listings/");

}));

//reviews(POST review ROUTE)
app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
res.redirect(`/listings/${listing._id}`)
}));


//delete review route
// delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//pull=delete
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));



// ..................................................................
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found")); 
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})







