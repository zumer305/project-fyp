// require express 
const express= require("express");
const app=express();

// require mongoose
const mongoose= require("mongoose");

const Listing=require("./models/listing.js");//import file listing

//path
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // let{id}=req.params;


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
//show route
app.get("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

})

