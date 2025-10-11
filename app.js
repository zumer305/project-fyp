
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

// test route
app.get("/", (req, res) => {
  res.send("This is root");
});

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


