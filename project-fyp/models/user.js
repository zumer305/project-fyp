const mongoose= require("mongoose");
const Schema=mongoose.Schema; 
const passportLocalMongoose=require("passport-local-mongoose");//username,password(hash orsalt)

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        },
        lastUpdated: {
            type: Date,
            default: null
        },
        sharingEnabled: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
})

// Create geospatial index for location queries
userSchema.index({ 'location.coordinates': '2dsphere' });

userSchema.plugin(passportLocalMongoose);//automatically (user,pass(hash or salt))
module.exports=mongoose.model("User",userSchema);
//also (set pass , change pass) automatic



