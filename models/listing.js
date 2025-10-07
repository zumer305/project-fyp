const mongoose= require("mongoose");
const Schema=mongoose.Schema; //VARIABLE ME STORE
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        // await Listing.create({ title: "Hotel", price: 1000 }) mtlab ka enter he ni kiya image variable
        default:"https://unsplash.com/photos/green-leaf-tree-under-blue-sky-tGTVxeOr_Rs",
        // empty iska matlab kch likha ni
        set:(v)=> v===""? "https://unsplash.com/photos/green-leaf-tree-under-blue-sky-tGTVxeOr_Rs":v,

    },
    price:Number,
    location:String,
    country:String,
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;