if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ===================
// REQUIREMENTS
// ===================
const express = require("express");
const app = express();
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

// ===================
// MIDDLEWARES
// ===================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

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

// Packages page
app.get("/packages", (req, res) => {
  const country = req.query.country;
  const budget = parseInt(req.query.budget) || 0;

  // Comprehensive package data for different budget ranges
  const allPackages = {
    // Dubai packages
    dubai: {
      budget10k: [
        {
          name: "Dubai Economy Explorer",
          price: 8500,
          duration: "5 Days",
          hotel: "3-Star Hotel Bur Dubai - $80/night",
          food: "Halal restaurants included - $30/day",
          transport: "Metro pass + airport transfers - $150",
          attractions: ["Burj Khalifa", "Dubai Mall", "Gold Souk", "Jumeirah Beach"],
          shopping: ["Dubai Mall", "Gold Souk", "Spice Souk"],
          weather: { current: "28°C Sunny", forecast: "Clear skies" },
          muslimFeatures: ["Halal food nearby", "Mosques within 2km", "Qibla direction provided", "Prayer time notifications"]
        },
        {
          name: "Dubai Budget Adventure",
          price: 9500,
          duration: "6 Days",
          hotel: "Budget hotel Deira - $60/night",
          food: "Local halal eateries - $25/day",
          transport: "Public transport pass - $100",
          attractions: ["Dubai Creek", "Bastakiya Quarter", "Dubai Museum", "Abra ride"],
          shopping: ["Deira Gold Souk", "Textile Souk", "Spice Souk"],
          weather: { current: "28°C Sunny", forecast: "Perfect for sightseeing" },
          muslimFeatures: ["Halal food guaranteed", "Multiple mosques nearby", "Ramadan friendly services"]
        }
      ],
      budget20k: [
        {
          name: "Dubai Premium Experience",
          price: 18000,
          duration: "7 Days",
          hotel: "5-Star Hotel Downtown - $250/night",
          food: "Premium halal dining - $80/day",
          transport: "Private car with driver - $500",
          attractions: ["Burj Khalifa At The Top", "Desert Safari", "Dubai Marina", "Palm Jumeirah"],
          shopping: ["Dubai Mall", "Mall of Emirates", "BurJuman Centre"],
          weather: { current: "28°C Sunny", forecast: "Clear and warm" },
          muslimFeatures: ["Luxury halal dining", "Private prayer facilities", "Qibla direction", "Ramadan services"]
        },
        {
          name: "Dubai Luxury Escape",
          price: 19500,
          duration: "8 Days",
          hotel: "Burj Al Arab Suite - $800/night",
          food: "Michelin halal restaurants - $150/day",
          transport: "Luxury car rental - $800",
          attractions: ["Burj Khalifa VIP", "Helicopter tour", "Private yacht", "Aquaventure Waterpark"],
          shopping: ["Dubai Mall VIP", "Gold Souk premium", "Designer boutiques"],
          weather: { current: "28°C Sunny", forecast: "Perfect luxury weather" },
          muslimFeatures: ["Premium halal cuisine", "Private prayer rooms", "Qibla compass", "Islamic concierge"]
        }
      ]
    },
    // Central Asian countries
    kyrgyzstan: {
      budget10k: [
        {
          name: "Kyrgyzstan Nature Adventure",
          price: 6800,
          duration: "6 Days",
          hotel: "Bishkek guesthouse - $45/night",
          food: "Traditional halal meals - $30/day",
          transport: "Shared tours + local transport - $250",
          attractions: ["Issyk-Kul Lake", "Ala Archa National Park", "Osh Bazaar", "Burana Tower"],
          shopping: ["Osh Bazaar", "Dordoi Bazaar", "Local crafts"],
          weather: { current: "15°C Mountain", forecast: "Cool and pleasant" },
          muslimFeatures: ["Halal local cuisine", "Mosques available", "Islamic heritage sites", "Prayer facilities"]
        }
      ],
      budget20k: [
        {
          name: "Kyrgyzstan Premium Expedition",
          price: 17500,
          duration: "8 Days",
          hotel: "Luxury mountain resort - $280/night",
          food: "Premium halal dining - $90/day",
          transport: "Private 4WD tours - $800",
          attractions: ["Tian Shan mountains", "Song-Kul Lake", "Jeti-Oguz", "Karakol town"],
          shopping: ["Premium felt crafts", "Traditional jewelry", "Local art"],
          weather: { current: "15°C Perfect", forecast: "Ideal mountain weather" },
          muslimFeatures: ["Premium halal dining", "Private prayer services", "Mountain mosque visits", "Ramadan mountain experience"]
        }
      ]
    },
    tajikistan: {
      budget10k: [
        {
          name: "Tajikistan Cultural Journey",
          price: 7500,
          duration: "7 Days",
          hotel: "Dushanbe hotel - $65/night",
          food: "Traditional Tajik halal cuisine - $35/day",
          transport: "Domestic transport - $300",
          attractions: ["Pamir Highway", "Iskanderkul Lake", "Hissar Fortress", "Rudaki Park"],
          shopping: ["Green Bazaar", "Local textiles", "Traditional crafts"],
          weather: { current: "20°C Pleasant", forecast: "Mild spring weather" },
          muslimFeatures: ["Halal Tajik cuisine", "Dushanbe mosques", "Islamic architecture", "Prayer time guidance"]
        }
      ],
      budget20k: [
        {
          name: "Tajikistan Luxury Adventure",
          price: 18800,
          duration: "9 Days",
          hotel: "Luxury Dushanbe suite - $320/night",
          food: "Fine halal dining - $110/day",
          transport: "Private mountain tours - $1000",
          attractions: ["Pamir Mountains VIP", "Seven Lakes", "Penjikent ruins", "Fann Mountains"],
          shopping: ["Premium Persian crafts", "Luxury textiles", "Antique jewelry"],
          weather: { current: "20°C Ideal", forecast: "Perfect travel conditions" },
          muslimFeatures: ["Luxury halal cuisine", "Private prayer facilities", "Mountain Islamic experiences", "Premium Ramadan services"]
        }
      ]
    },
    turkmenistan: {
      budget10k: [
        {
          name: "Turkmenistan Heritage Tour",
          price: 8200,
          duration: "6 Days",
          hotel: "Ashgabat hotel - $75/night",
          food: "Traditional halal meals - $40/day",
          transport: "City tours + transport - $350",
          attractions: ["Ashgabat city", "Ancient Merv", "Darvaza Gas Crater", "Nisa fortress"],
          shopping: ["Tolkuchka Bazaar", "Carpet shops", "Traditional jewelry"],
          weather: { current: "25°C Warm", forecast: "Desert climate" },
          muslimFeatures: ["Halal Turkmen cuisine", "Ashgabat mosques", "Islamic historical sites", "Prayer facilities"]
        }
      ],
      budget20k: [
        {
          name: "Turkmenistan Premium Experience",
          price: 19500,
          duration: "8 Days",
          hotel: "Luxury Ashgabat resort - $380/night",
          food: "Premium halal dining - $130/day",
          transport: "Private luxury tours - $1200",
          attractions: ["Ashgabat VIP tour", "Ancient Urgench", "Konye-Urgench", "Caspian Sea coast"],
          shopping: ["Premium Turkmen crafts", "Luxury carpets", "Designer boutiques"],
          weather: { current: "25°C Desert", forecast: "Warm and dry" },
          muslimFeatures: ["Premium halal dining", "Private prayer services", "Desert Islamic experiences", "Luxury Ramadan amenities"]
        }
      ]
    },
    uzbekistan: {
      budget10k: [
        {
          name: "Uzbekistan Silk Road Adventure",
          price: 7200,
          duration: "7 Days",
          hotel: "Tashkent guesthouse - $55/night",
          food: "Traditional Uzbek halal cuisine - $32/day",
          transport: "Domestic trains + transport - $400",
          attractions: ["Samarkand Registan", "Bukhara old city", "Khiva Itchan Kala", "Tashkent metro"],
          shopping: ["Chorsu Bazaar", "Silk road crafts", "Ceramics"],
          weather: { current: "22°C Pleasant", forecast: "Mild spring conditions" },
          muslimFeatures: ["Halal Uzbek cuisine", "Historic mosques", "Islamic architecture", "Prayer time guidance"]
        }
      ],
      budget20k: [
        {
          name: "Uzbekistan Luxury Silk Road",
          price: 18200,
          duration: "9 Days",
          hotel: "Luxury Tashkent hotel - $300/night",
          food: "Premium halal dining - $95/day",
          transport: "Private luxury tours - $900",
          attractions: ["Samarkand VIP tour", "Bukhara luxury experience", "Khiva exclusive", "Fergana Valley"],
          shopping: ["Premium silk crafts", "Luxury ceramics", "Antique jewelry"],
          weather: { current: "22°C Perfect", forecast: "Ideal travel weather" },
          muslimFeatures: ["Premium halal cuisine", "Private prayer facilities", "Historic Islamic tours", "Luxury Ramadan services"]
        }
      ]
    },
    azerbaijan: {
      budget10k: [
        {
          name: "Azerbaijan Cultural Tour",
          price: 7200,
          duration: "6 Days",
          hotel: "Baku city hotel - $70/night",
          food: "Traditional halal cuisine - $35/day",
          transport: "City transport + tours - $200",
          attractions: ["Old City Baku", "Flame Towers", "Gobustan", "Carpet Museum"],
          shopping: ["Taza Bazaar", "Nizami Street", "Carpet shops"],
          weather: { current: "22°C Mild", forecast: "Pleasant spring weather" },
          muslimFeatures: ["Halal restaurants", "Mosques in Baku", "Islamic heritage sites", "Prayer facilities"]
        }
      ],
      budget20k: [
        {
          name: "Azerbaijan Premium Journey",
          price: 18500,
          duration: "8 Days",
          hotel: "Luxury Baku resort - $300/night",
          food: "Fine halal dining - $100/day",
          transport: "Private tours - $600",
          attractions: ["Sheki Palace", "Gabala tour", "Fire Temple", "Mud volcanoes"],
          shopping: ["Premium boutiques", "Local crafts", "Caspian pearls"],
          weather: { current: "22°C Perfect", forecast: "Ideal travel weather" },
          muslimFeatures: ["Premium halal dining", "Private prayer services", "Islamic historical tours", "Ramadan amenities"]
        }
      ]
    },
    kazakhstan: {
      budget10k: [
        {
          name: "Kazakhstan Adventure",
          price: 8900,
          duration: "7 Days",
          hotel: "Almaty business hotel - $90/night",
          food: "Local halal cuisine - $40/day",
          transport: "Domestic flights + transport - $400",
          attractions: ["Charyn Canyon", "Big Almaty Lake", "Kok Tobe", "Medeu"],
          shopping: ["Green Bazaar", "Dostyk Plaza", "Local markets"],
          weather: { current: "18°C Cool", forecast: "Mountain weather" },
          muslimFeatures: ["Halal food available", "Mosques in Almaty", "Islamic culture", "Prayer times"]
        }
      ],
      budget20k: [
        {
          name: "Kazakhstan Luxury Expedition",
          price: 19200,
          duration: "9 Days",
          hotel: "Luxury mountain resort - $350/night",
          food: "Gourmet halal cuisine - $120/day",
          transport: "Private helicopter tours - $1500",
          attractions: ["Altai Mountains", "Charyn Canyon VIP", "Astana city tour", "Private ski resorts"],
          shopping: ["Luxury malls Astana", "Premium local crafts", "Designer stores"],
          weather: { current: "18°C Fresh", forecast: "Perfect mountain climate" },
          muslimFeatures: ["Luxury halal dining", "Private prayer facilities", "Islamic cultural experiences", "Premium Ramadan services"]
        }
      ]
    }
  };

  // Determine budget category
  let budgetCategory = 'budget10k';
  if (budget >= 15000) {
    budgetCategory = 'budget20k';
  }

  // Get country key (lowercase)
  const countryKey = country.toLowerCase().replace(/\s+/g, '');
  
  // Get packages for the selected country and budget
  let packagesList = [];
  if (allPackages[countryKey] && allPackages[countryKey][budgetCategory]) {
    packagesList = allPackages[countryKey][budgetCategory];
  } else {
    // Default packages for unknown countries or budget ranges
    packagesList = [
      {
        name: `${country} Standard Package`,
        price: budget * 0.8,
        duration: "5 Days",
        hotel: "Comfortable 3-star accommodation",
        food: "Halal meals included",
        transport: "Airport transfers and local transport",
        attractions: ["City tour", "Cultural sites", "Local markets"],
        shopping: ["Traditional markets", "Local crafts"],
        weather: { current: "Please check current weather", forecast: "Seasonal weather expected" },
        muslimFeatures: ["Halal food available", "Mosque locations provided", "Prayer time information"]
      }
    ];
  }

  res.render("listings/packages", { country, budget, packagesList, budgetCategory });
});

// Mount routers
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

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
// SERVER START
// ===================
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
