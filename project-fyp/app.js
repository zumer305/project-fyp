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
const fs = require("fs");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// MODELS
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const Booking = require("./models/booking.js");

// Import data from data.js
const initData = require("./init/data.js");


// UTILITIES
const { convertBudgetToUSD } = require("./utils/currencyHelper.js");
const nodemailer = require("nodemailer");

const EMAIL_FROM =
  process.env.EMAIL_USER || "ai.based.destination.explorer@gmail.com";
const EMAIL_PASSWORD =
  process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:8080";

const sanitizeText = (text = "") =>
  typeof text === "string"
    ? text.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
          c
        ]
      )
    : "";

const createEmailTransporter = () => {
  if (!EMAIL_FROM || !EMAIL_PASSWORD) {
    console.warn("Email credentials missing; skipping email notifications.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_FROM,
      pass: EMAIL_PASSWORD,
    },
  });
};

const groupChatLink = (groupId) => `${APP_BASE_URL}/groups/${groupId}/chat`;

const sendGroupEmail = async (group, { subject, html, excludeUserId }) => {
  const transporter = createEmailTransporter();
  if (!transporter) return;

  const recipients = Array.from(
    new Set(
      (group.members || [])
        .filter((m) => !excludeUserId || m._id?.toString() !== excludeUserId)
        .map((m) => m.email)
        .filter(Boolean)
    )
  );

  if (recipients.length === 0) {
    console.warn(`No recipient emails found for group ${group._id}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      bcc: recipients,
      subject,
      html,
    });
    console.log(
      `📧 Sent group email to ${recipients.length} recipient(s) for group ${group._id}`
    );
  } catch (err) {
    console.error("❌ Failed to send group email:", err);
  }
};

// ===================
// DATASET HELPERS
// ===================
const packageDatasetPath = path.join(
  __dirname,
  "dataset",
  "central_asia_travel_packages.txt"
);

let cachedPackageDataset = null;

const parsePackageDataset = () => {
  if (cachedPackageDataset) return cachedPackageDataset;

  try {
    const raw = fs.readFileSync(packageDatasetPath, "utf-8");
    const lines = raw.trim().split(/\r?\n/);
    // Remove header
    lines.shift();

    cachedPackageDataset = lines
      .map((line) => line.split(","))
      .filter((cols) => cols.length >= 12)
      .map((cols) => ({
        country: cols[0].trim(),
        city: cols[1].trim(),
        packageType: cols[2].trim(),
        duration: cols[3].trim(),
        flights: Number(cols[4]) || 0,
        hotel: Number(cols[5]) || 0,
        food: Number(cols[6]) || 0,
        transport: Number(cols[7]) || 0,
        attractions: Number(cols[8]) || 0,
        shopping: Number(cols[9]) || 0,
        misc: Number(cols[10]) || 0,
        total: Number(cols[11]) || 0,
      }));

    return cachedPackageDataset;
  } catch (err) {
    console.error("Failed to read package dataset:", err);
    cachedPackageDataset = [];
    return cachedPackageDataset;
  }
};

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const detectPackageType = (packageDetails = {}) => {
  const candidateStrings = [
    packageDetails.packageType,
    packageDetails.PackageType,
    packageDetails.type,
    packageDetails.packageTitle,
    packageDetails.title,
  ]
    .concat(
      packageDetails.fullPackage && typeof packageDetails.fullPackage === "object"
        ? [
            packageDetails.fullPackage.packageType,
            packageDetails.fullPackage.type,
            packageDetails.fullPackage.title,
          ]
        : []
    )
    .filter(Boolean)
    .map((s) => s.toString().toLowerCase());

  const has = (needle) => candidateStrings.some((s) => s.includes(needle));
  if (has("budget")) return "Budget";
  if (has("mid")) return "Mid-Range";
  if (has("lux")) return "Luxury";
  return null;
};

const findDatasetPackage = (latestBooking) => {
  if (!latestBooking || !latestBooking.packageDetails) return null;
  const packages = parsePackageDataset();
  if (!packages.length) return null;

  const details = latestBooking.packageDetails;
  const country =
    details.country ||
    details.destination ||
    (details.fullPackage && details.fullPackage.country) ||
    null;
  const city =
    details.destination ||
    details.city ||
    (details.fullPackage && details.fullPackage.city) ||
    null;
  const packageType = detectPackageType(details);

  const matches = packages.filter(
    (p) =>
      (!country || normalize(p.country) === normalize(country)) &&
      (!city || normalize(p.city) === normalize(city))
  );

  if (matches.length) {
    if (packageType) {
      const typeMatch = matches.find(
        (p) => normalize(p.packageType) === normalize(packageType)
      );
      if (typeMatch) return typeMatch;
    }
    return matches[0];
  }

  // Fallback: match by country only
  const countryMatches = packages.filter(
    (p) => country && normalize(p.country) === normalize(country)
  );
  if (countryMatches.length) {
    if (packageType) {
      const typeMatch = countryMatches.find(
        (p) => normalize(p.packageType) === normalize(packageType)
      );
      if (typeMatch) return typeMatch;
    }
    return countryMatches[0];
  }

  return null;
};

// ROUTES
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const groupsRouter = require("./routes/groups.js");
const bookingRouter = require("./routes/booking.js");
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
const apiEmergencyRouter = require("./routes/api/emergency.js");

// ERROR HANDLER
const ExpressError = require("./utils/ExpressError.js");

// ===================
// MONGODB CONNECTION
// ===================
const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const sessionSecret = process.env.SESSION_SECRET || "mysupersecretcode";

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
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
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
  res.locals.adminEmail = EMAIL_FROM || "support@example.com";
  res.locals.supportPhone = "03184070936";
  res.locals.brandName = "AI Based Destination Explorer";
  next();
});

// ===================
// ROUTES
// ===================

// Home page
app.get("/", async (req, res) => {
  try {
    let latestBooking = null;
    if (req.user) {
      latestBooking = await Booking.findOne({ user: req.user._id }).sort({
        createdAt: -1,
      });
    }

    res.render("listings/h.ejs", { latestBooking });
  } catch (err) {
    console.warn("⚠️ Failed to load latest booking for home:", err);
    res.render("listings/h.ejs", { latestBooking: null });
  }
});

// Expense details for latest booking
app.get("/expenses/latest", async (req, res) => {
  if (!req.user) {
    req.flash("error", "Please log in to view expense details.");
    return res.redirect("/login");
  }

  try {
    const latestBooking = await Booking.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const datasetExpense = findDatasetPackage(latestBooking);
    const datasetAvailable = parsePackageDataset();

    res.render("listings/expense-details", {
      latestBooking,
      datasetExpense,
      datasetAvailable,
    });
  } catch (err) {
    console.error("Failed to load expense details:", err);
    req.flash("error", "Could not load expense details. Please try again.");
    res.redirect("/");
  }
});

// Packages page (dataset-driven with TXT exact match fallback)
app.get("/packages", async (req, res) => {
  try {
    const country = (req.query.country || "").trim();
    const budget = parseFloat(req.query.budget) || 0;
    const currency = (req.query.currency || "USD").toUpperCase();
    const durationDays = parseInt(req.query.days) || undefined;

    // If user navigates without selecting a package/budget, show a friendly message
    if (!country || !budget) {
      return res.render("listings/packages", {
        country,
        budget,
        currency,
        budgetUSD: 0,
        packagesList: [],
        budgetCategory: null,
        noSelection: true,
      });
    }

    // Convert budget to USD for filtering
    const budgetUSD = await convertBudgetToUSD(budget, currency);
    console.log(
      `Packages request: ${budget} ${currency} = ${budgetUSD.toFixed(2)} USD`
    );

    // TXT-based exact filtering: show all packages under the given budget (in PKR) for the selected country
    // Falls back to generator if no TXT matches are found
    const { getPKRPerUSD, listPackagesUnderBudget } = require("../services/pricing.js");
    const pkrPerUSD = await getPKRPerUSD();
    const budgetPKR = Math.round(budgetUSD * pkrPerUSD);

    let packagesList = [];
    if (country && budgetPKR > 0) {
      const txtMatches = listPackagesUnderBudget(country, budgetPKR);
      if (txtMatches && txtMatches.length > 0) {
        // Map TXT rows to UI-friendly package objects with exact TXT data
        packagesList = txtMatches.map((row, idx) => {
          const priceUSD = Math.round(row.price_pkr / pkrPerUSD);
          const breakdownUSD = {
            flights: Math.round(row.breakdown.flights / pkrPerUSD),
            hotel: Math.round(row.breakdown.hotel / pkrPerUSD),
            food: Math.round(row.breakdown.food / pkrPerUSD),
            transport: Math.round(row.breakdown.transport / pkrPerUSD),
            attractions: Math.round(row.breakdown.attractions / pkrPerUSD),
            shopping: Math.round(row.breakdown.shopping / pkrPerUSD),
            misc: Math.round(row.breakdown.misc / pkrPerUSD),
          };
          return {
            id: `${row.country}_${row.city}_${row.tier}_${row.days}_${idx}`,
            country: row.country,
            city: row.city,
            tier: row.tier,
            name: `${row.city} - ${row.tier.charAt(0).toUpperCase() + row.tier.slice(1)}`,
            duration: `${row.days} Days`,
            durationDays: row.days,
            price: priceUSD,
            priceUSD: priceUSD,
            totalEstimateUSD: priceUSD,
            totalPKR: row.price_pkr,
            // Breakdown in PKR (from TXT file - exact values)
            breakdownPKR: {
              flights: row.breakdown.flights,
              hotel: row.breakdown.hotel,
              food: row.breakdown.food,
              transport: row.breakdown.transport,
              attractions: row.breakdown.attractions,
              shopping: row.breakdown.shopping,
              misc: row.breakdown.misc,
            },
            // Breakdown in USD (converted)
            breakdownUSD: breakdownUSD,
            hotel: `Hotel - Rs${row.breakdown.hotel.toLocaleString()} (~$${breakdownUSD.hotel})`,
            food: `Food & Dining - Rs${row.breakdown.food.toLocaleString()} (~$${breakdownUSD.food})`,
            transport: `Transport - Rs${row.breakdown.transport.toLocaleString()} (~$${breakdownUSD.transport})`,
            attractions: [`Attractions - Rs${row.breakdown.attractions.toLocaleString()} (~$${breakdownUSD.attractions})`],
            shopping: [`Shopping - Rs${row.breakdown.shopping.toLocaleString()} (~$${breakdownUSD.shopping})`],
            misc: `Insurance & Misc - Rs${row.breakdown.misc.toLocaleString()} (~$${breakdownUSD.misc})`,
            flights: `Flights - Rs${row.breakdown.flights.toLocaleString()} (~$${breakdownUSD.flights})`,
          };
        });
      }
    }

    // Fallback to AI planner if no TXT matches
    if (!packagesList || packagesList.length === 0) {
      packagesList = await generatePackages({
        country,
        budgetUSD,
        durationDays,
      });
    }

    res.render("listings/packages", {
      country,
      budget,
      currency,
      budgetUSD: budgetUSD.toFixed(2),
      packagesList,
      budgetCategory: budgetUSD >= 15000 ? "budget20k" : "budget10k",
    });
  } catch (error) {
    console.error("Error in /packages:", error);
    res.status(500).send("Error loading packages");
  }
});

// API: return generated packages as JSON (used by home recommendations)
app.get("/api/packages", async (req, res) => {
  try {
    const country = (req.query.country || "").trim();
    const budget = parseFloat(req.query.budget) || 0;
    const currency = (req.query.currency || "USD").toUpperCase();
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
        priceUSD: listing.price, // Assume listings are in USD
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

    // Convert budget to USD for filtering
    const budgetUSD = await convertBudgetToUSD(budget, currency);
    console.log(
      `API packages request: ${budget} ${currency} = ${budgetUSD.toFixed(
        2
      )} USD`
    );

    // Use generatePackages logic with budgetUSD
    const packagesList = await generatePackages({
      country,
      budgetUSD,
      durationDays,
    });
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
app.use("/groups", groupsRouter);
app.use("/", bookingRouter); // Booking routes (handles /book and /bookings/*)
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
app.use("/api/emergency", apiEmergencyRouter);

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
  // Log full error for debugging in development
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", err?.stack || err);
  }
  res.status(statusCode).render("error.ejs", { message });
});

// ===================
// SOCKET.IO EVENTS
// ===================
const Message = require("./models/message.js");
const Group = require("./models/group.js");

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("join", async ({ groupId, userId }) => {
    if (groupId) {
      socket.join(`group:${groupId}`);
      console.log(`User ${userId} joined group ${groupId}`);

      // Notify other members
      socket.to(`group:${groupId}`).emit("system", {
        type: "join",
        userId,
        timestamp: new Date(),
      });
    }
  });

  socket.on("message", async ({ groupId, userId, username, content }) => {
    if (!groupId || !content) return;

    try {
      // Verify user is a member and load member emails for notifications
      const group = await Group.findById(groupId).populate(
        "members",
        "username email"
      );
      if (!group || !group.members.some((m) => m._id.toString() === userId)) {
        console.log("Unauthorized message attempt");
        return;
      }

      const trimmedContent = content.trim();

      // Save message to database
      const msg = await Message.create({
        group: groupId,
        user: userId,
        content: trimmedContent,
        type: "text",
      });

      // Broadcast to all clients in the group (including sender)
      io.to(`group:${groupId}`).emit("message", {
        id: msg._id,
        userId,
        username,
        content: trimmedContent,
        createdAt: msg.createdAt,
        type: "text",
      });

      // Email notification to other members
      await sendGroupEmail(group, {
        subject: `New message in ${group.name || "your group"}`,
        html: `
          <p><strong>${sanitizeText(
            username || "A group member"
          )}</strong> posted a new message in <strong>${sanitizeText(
          group.name || "your group"
        )}</strong>:</p>
          <blockquote style="margin:12px 0;padding-left:12px;border-left:4px solid #eee;">
            ${sanitizeText(trimmedContent)}
          </blockquote>
          <p><a href="${groupChatLink(group._id)}">Open group chat</a></p>
        `,
        excludeUserId: userId,
      });

      console.log(`Message sent in group ${groupId} by ${username}`);
    } catch (e) {
      console.error("Error handling message:", e);
    }
  });

  socket.on("location-update", ({ groupId, userId, coords }) => {
    if (groupId && coords) {
      socket.to(`group:${groupId}`).emit("location-update", {
        userId,
        coords,
        timestamp: new Date(),
      });
    }
  });

  socket.on("leave", ({ groupId, userId }) => {
    if (groupId) {
      socket.leave(`group:${groupId}`);
      console.log(`User ${userId} left group ${groupId}`);

      // Notify other members
      socket.to(`group:${groupId}`).emit("system", {
        type: "leave",
        userId,
        timestamp: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ===================
// SERVER START
// ===================
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
