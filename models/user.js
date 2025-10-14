const mongoose= require("mongoose");
const Schema=mongoose.Schema; 
const passportLocalMongoose=require("passport-local-mongoose");//username,password(hash orsalt)

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
})
userSchema.plugin(passportLocalMongoose);//automatically (user,pass(hash or salt))
module.exports=mongoose.model("User",userSchema);
//also (set pass , change pass) automatic



