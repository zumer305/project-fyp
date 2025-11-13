if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ===================
// REQUIREMENTS
// ===================
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// MODELS
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

// ROUTES
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// API routes
const apiAuthRouter = require("./routes/api/auth.js");
const apiDestRouter = require("./routes/api/destinations.js");
const apiWeatherRouter = require("./routes/api/weather.js");
const apiMapRouter = require("./routes/api/map.js");
const apiGroupsRouter = require("./routes/api/groups.js");
const apiFaithRouter = require("./routes/api/faith.js");

// ERROR HANDLER
const ExpressError = require("./utils/ExpressError.js");

// ===================
// MONGODB CONNECTION
// ===================
const url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(url);
  console.log("Connected to MongoDB");
}

main().catch(err => console.log(err));

// ===================
// EJS MATE + VIEWS
// ===================
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Dataset-driven planner service
const { generatePackages } = require("../services/planner.js");

// ===================
// MIDDLEWARES
// ===================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// SESSION CONFIG
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

app.use(session(sessionOptions));
app.use(flash());

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===================
// FLASH & CURRENT USER FOR ALL VIEWS
// ===================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // <- VERY IMPORTANT: fixes your navbar error
  next();
});

// ===================
// ROUTES
// ===================

// Home page
app.get("/", (req, res) => {
  res.render("listings/h.ejs");
});

// Packages page (dataset-driven)
app.get("/packages", (req, res) => {
  const country = (req.query.country || "").trim();
  const budget = parseInt(req.query.budget) || 0;
  const durationDays = parseInt(req.query.days) || undefined;

  const packagesList = generatePackages({ country, budget, durationDays });
  const budgetCategory = budget >= 15000 ? "budget20k" : "budget10k";
  res.render("listings/packages", { country, budget, packagesList, budgetCategory });
});

// Mount routers
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
// Mount API routers
app.use("/api/auth", apiAuthRouter);
app.use("/api/destinations", apiDestRouter);
app.use("/api/weather", apiWeatherRouter);
app.use("/api/map", apiMapRouter);
app.use("/api/groups", apiGroupsRouter);
app.use("/api/faith", apiFaithRouter);

// ===================
// 404 HANDLER
// ===================
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ===================
// GLOBAL ERROR HANDLER
// ===================
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ===================
// SOCKET.IO EVENTS
// ===================
const Message = require("./models/message.js");
io.on("connection", (socket) => {
  socket.on("join", ({ groupId, userId }) => {
    if (groupId) {
      socket.join(`group:${groupId}`);
      io.to(`group:${groupId}`).emit("system", { type: "join", userId });
    }
  });

  socket.on("message", async ({ groupId, userId, content }) => {
    if (!groupId || !content) return;
    try {
      const msg = await Message.create({ group: groupId, user: userId, content });
      io.to(`group:${groupId}`).emit("message", { id: msg.id, userId, content, createdAt: msg.createdAt });
    } catch (e) {
      // swallow
    }
  });

  socket.on("location-update", ({ groupId, userId, coords }) => {
    if (groupId && coords) {
      io.to(`group:${groupId}`).emit("location-update", { userId, coords });
    }
  });

  socket.on("leave", ({ groupId, userId }) => {
    if (groupId) {
      socket.leave(`group:${groupId}`);
      io.to(`group:${groupId}`).emit("system", { type: "leave", userId });
    }
  });
});

// ===================
// SERVER START
// ===================
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
