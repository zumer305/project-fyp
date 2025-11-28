const mongoose= require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
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

const initDb=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:'68ee890b5bc02952545d9bb6',
    }))
    await Listing.insertMany(initData.data);
    console.log('Data is initialized');
}
initDb();
