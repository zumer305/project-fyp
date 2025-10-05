// require express 
const express= require("express");
const app=express();

// require mongoose
const mongoose= require("mongoose");


app.listen(8080,()=>{
    console.log("app is listening to the port 8080");
});
app.get("/",(req,res)=>{
    res.send("This is root");//print,res.render(file),res.redirect(link)
});


const url='mongodb://127.0.0.1:27017/test';
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
