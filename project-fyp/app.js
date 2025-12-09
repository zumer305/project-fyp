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

// Import data from data.js
const initData = require("./init/data.js");

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
const apiTaxiFaresRouter = require("./routes/api/taxiFares.js");
const apiEventsRouter = require("./routes/api/events.js");
const apiEventDetailsRouter = require("./routes/api/eventDetails.js");
const apiEventbriteRouter = require("./routes/api/eventbrite.js");
const apiCurrencyRouter = require("./routes/api/currency.js");
const apiWorldTimeRouter = require("./routes/api/worldTime.js");

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

async function syncListingsFromInitData() {
  try {
    const listingsFromFile = Array.isArray(initData.data) ? initData.data : [];

    if (listingsFromFile.length === 0) {
      console.warn("init/data.js did not provide any listings to seed.");
      return;
    }

    const normalizedListings = listingsFromFile.map((listing) => {
      const image =
        listing.image && typeof listing.image === "object"
          ? listing.image
          : {
              filename: "listingimage",
              url: listing.image,
            };

      return {
        ...listing,
        image,
      };
    });

    await Listing.deleteMany({});
    const inserted = await Listing.insertMany(normalizedListings);
    console.log(`Seeded ${inserted.length} listings from init/data.js`);
  } catch (err) {
    console.error("Error seeding listings from init/data.js:", err);
  }
}

main()
  .then(syncListingsFromInitData)
  .catch((err) => console.log(err));

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
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
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
  res.render("listings/packages", {
    country,
    budget,
    packagesList,
    budgetCategory,
  });
});

// API: return generated packages as JSON (used by home recommendations)
app.get("/api/packages", (req, res) => {
  try {
    const country = (req.query.country || "").trim();
    const budget = parseInt(req.query.budget) || 0;
    const durationDays = parseInt(req.query.days) || undefined;

    // If no filters provided, return actual listings from data.js
    if (!country && !budget) {
      const listings = initData.data.map((listing, index) => ({
        _id: `listing_${index}`,
        name: listing.title,
        title: listing.title,
        description: listing.description,
        image: listing.image?.url || listing.image,
        images: listing.image?.url
          ? [listing.image.url]
          : listing.image
          ? [listing.image]
          : [],
        price: listing.price,
        location: listing.location,
        country: listing.country,
        minBudget: listing.price,
        maxBudget: listing.price * 1.2,
        typicalDuration: 5,
        attractions: listing.description
          .split(".")
          .slice(0, 3)
          .map((s) => s.trim())
          .filter(Boolean),
      }));
      return res.json({ items: listings });
    }

    // Otherwise use the generatePackages logic
    const packagesList = generatePackages({ country, budget, durationDays });
    return res.json({ items: packagesList });
  } catch (e) {
    console.error("Error in /api/packages:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// Package detail page (client reads cached selection from browser storage)
app.get("/package-detail", (req, res) => {
  res.render("listings/packageDetail");
});

// Taxi fares page
app.get("/fares", (req, res) => {
  res.render("listings/fares");
});

// Events and festivals page
app.get("/events", (req, res) => {
  res.render("listings/events");
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
app.use("/api/taxi-fares", apiTaxiFaresRouter);
app.use("/api/events", apiEventsRouter);
app.use("/api/event-details", apiEventDetailsRouter);
app.use("/api/eventbrite", apiEventbriteRouter);
app.use("/api/currency", apiCurrencyRouter);
app.use("/api/worldtime", apiWorldTimeRouter);

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
      const msg = await Message.create({
        group: groupId,
        user: userId,
        content,
      });
      io.to(`group:${groupId}`).emit("message", {
        id: msg.id,
        userId,
        content,
        createdAt: msg.createdAt,
      });
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
