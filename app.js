
// require express 
const express = require("express");
const app = express();

// require mongoose
const mongoose = require("mongoose");

// models
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

// ejs-mate setup
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// path setup
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//session
const session=require("express-session");
//flash
const flash=require("connect-flash");

// middlewares
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// error handlers
const ExpressError = require("./utils/ExpressError.js");

// routes import
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// connect MongoDB
const url = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(url);
}

//session
const sessionOptions= {
    secret: "mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now() +7*24*60*60*1000, //after 1 week cookie me sa login pass email de
    
      maxAge:+7*24*60*60*1000,
      httpOnly:true,
    }
  };
  // test route
app.get("/", (req, res) => {
  res.send("This is root");
});

app.use(session(sessionOptions));
// listing review sa pahaly flash ko likhna
app.use(flash());

// test route
app.get("/", (req, res) => {
  res.send("This is root");
});

// middleware alert msj 
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

// mount routers (⚠️ IMPORTANT: use `/` not `./`)
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// global error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// server start
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});


