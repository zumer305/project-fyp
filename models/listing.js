const mongoose= require("mongoose");
const Schema=mongoose.Schema; //VARIABLE ME STORE
const Review=require("./review.js")
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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ]
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;