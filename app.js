// require express 
const express= require("express");
const app=express();

// require mongoose
const mongoose= require("mongoose");

const Listing=require("./models/listing.js");//import file listing

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
app.get("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

});
//create route
app.post("/listings",wrapAsync(async(req,res,next)=>{
//   let {title,description,price,country,image,location}=req.body;

    const newListing=new Listing(req.body.listing);
 await newListing.save();
 res.redirect("/listings");






}));
//edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
//update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
res.redirect("/listings/");

});
// ..................................................................
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found")); 
})
app.use((err,req,res,next)=>{
    let{statusCode,message}=err;
    res.status(statusCode).send(message);
})








