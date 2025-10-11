const express = require("express");
const app = express();
const session = require("express-session");

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
    req.session.name=name,
  res.redirect("/hello");
});
// /hello
// /register?name=zumer
// /hello
app.get("/hello", (req, res) => {
  res.send(`hello ${req.session.name}`);
});




// Test route
app.get("/test", (req, res) => {
  res.send("test successful!");
});

// Server start
app.listen(3000, () => {
  console.log("server is listening to 3000");
});
