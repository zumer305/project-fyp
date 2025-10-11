const express = require("express");
const app = express();
const session = require("express-session");
const flash=require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes import
// const users = require("./routes/user.js");
// const posts = require("./routes/post.js");



// Session setup
const sessionOptions= {
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true,
  };
app.use(session(sessionOptions));
app.use(flash());


// app.get("/reqaccount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
// req.session.count=1;
//     }
    
//   res.send(`You send a request ${req.session.count} times!`);
// });


// /register?name=zumer
app.get("/register", (req, res) => {
    let{name="anyone"}=req.query;
    req.session.name=name;
    if(name==="anyone"){
       req.flash("error","user not registered successfully!");
    }
    else{
    req.flash("success","user registered successfully!");
    }
  res.redirect("/hello");
});
// /hello
// /register?name=zumer
// /hello
app.use((req,res,next)=>{
   res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();

})
app.get("/hello", (req, res) => {
  // res.send(`hello ${req.session.name}`);
 
  res.render("page.ejs",{name:req.session.name});
});




// Test route
app.get("/test", (req, res) => {
  res.send("test successful!");
});

// Server start
app.listen(3000, () => {
  console.log("server is listening to 3000");
});
