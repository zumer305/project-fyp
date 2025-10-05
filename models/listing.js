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
        default:"https://unsplash.com/photos/green-leaf-tree-under-blue-sky-tGTVxeOr_Rs",
        set:(v)=> v===""? "https://unsplash.com/photos/green-leaf-tree-under-blue-sky-tGTVxeOr_Rs":v,
    },
    price:Number,
    location:String,
    countryy:String,
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;