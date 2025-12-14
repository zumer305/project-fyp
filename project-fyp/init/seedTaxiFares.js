// Static taxi fares data for Central Asia
// Data includes: Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan, Azerbaijan

const taxiFaresData = [
  // ========== KAZAKHSTAN (Almaty - Yandex Go) ==========
  {
    name: "Economy Class",
    type: "Economy",
    capacity: "4 passengers",
    baseFare: 0.88, // ₸420 ≈ $0.88 USD
    perKm: 0.14, // ₸65/km ≈ $0.14 USD
    waitingCharge: 0.08, // ₸40/min ≈ $0.08 USD
    imageUrl:
      "https://suzukipakistan.com/Media/Used-Cars/Product/15814073203.jpg",
    emoji: "🚗",
    features: [
      "Compact/Hatchback",
      "2 min free wait",
      "Includes 1 km + 3 min",
      "Budget Friendly",
    ],
    country: "Kazakhstan",
    city: "Almaty",
    currency: "KZT",
    originalBaseFare: 420,
    originalPerKm: 65,
    originalWaiting: 40,
  },
  {
    name: "Business Class",
    type: "Business",
    capacity: "4 passengers",
    baseFare: 1.89, // ₸900 ≈ $1.89 USD
    perKm: 0.28, // ₸135/km ≈ $0.28 USD
    waitingCharge: 0.17, // ₸80/min ≈ $0.17 USD
    imageUrl:
      "https://editorial.pxcrush.net/carsales/general/editorial/corolla-sedan-4.jpg?width=1024&height=682",
    emoji: "🚘",
    features: [
      "Premium Sedan",
      "2 min free wait",
      "Includes 1 km + 3 min",
      "Professional Service",
    ],
    country: "Kazakhstan",
    city: "Almaty",
    currency: "KZT",
    originalBaseFare: 900,
    originalPerKm: 135,
    originalWaiting: 80,
  },
  {
    name: "Premier Class",
    type: "Premier",
    capacity: "4 passengers",
    baseFare: 2.62, // ₸1,250 ≈ $2.62 USD
    perKm: 0.37, // ₸174/km ≈ $0.37 USD
    waitingCharge: 0.25, // ₸120/min ≈ $0.25 USD
    imageUrl:
      "https://www.luxurycarrental.ae/storage/vehicles/April2024/oyNr3oQBRzxRD8FfRXmu.png",
    emoji: "🚙",
    features: [
      "Executive Sedan",
      "2 min free wait",
      "Includes 1 km + 3 min",
      "Luxury Experience",
    ],
    country: "Kazakhstan",
    city: "Almaty",
    currency: "KZT",
    originalBaseFare: 1250,
    originalPerKm: 174,
    originalWaiting: 120,
  },

  // ========== UZBEKISTAN (Tashkent - Yandex Go) ==========
  {
    name: "Comfort Class",
    type: "Comfort",
    capacity: "4 passengers",
    baseFare: 0.42, // 5,400 sum ≈ $0.42 USD
    perKm: 0.11, // 1,400 sum/km ≈ $0.11 USD
    waitingCharge: 0.05, // 650 sum/min ≈ $0.05 USD
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Daewoo_Nexia_2013.JPG",
    emoji: "🚗",
    features: [
      "Budget Sedan",
      "2 min free wait",
      "Includes 1 km + 3 min",
      "Popular in Tashkent",
    ],
    country: "Uzbekistan",
    city: "Tashkent",
    currency: "UZS",
    originalBaseFare: 5400,
    originalPerKm: 1400,
    originalWaiting: 650,
  },
  {
    name: "Comfort+ Class",
    type: "Comfort+",
    capacity: "4 passengers",
    baseFare: 0.69, // 8,900 sum ≈ $0.69 USD
    perKm: 0.17, // 2,200 sum/km ≈ $0.17 USD
    waitingCharge: 0.05, // 700 sum/min ≈ $0.05 USD
    imageUrl:
      "https://www.autosbangla.com/images/suzuki/suzuki-wagon-r-img1.jpg",
    emoji: "🚙",
    features: [
      "Larger Sedan",
      "2 min free wait",
      "Includes 1 km + 3 min",
      "Extra Comfort",
    ],
    country: "Uzbekistan",
    city: "Tashkent",
    currency: "UZS",
    originalBaseFare: 8900,
    originalPerKm: 2200,
    originalWaiting: 700,
  },
  {
    name: "Business Class",
    type: "Business",
    capacity: "4 passengers",
    baseFare: 0.84, // 10,800 sum ≈ $0.84 USD
    perKm: 0.22, // 2,850 sum/km ≈ $0.22 USD
    waitingCharge: 0.06, // 750 sum/min ≈ $0.06 USD
    imageUrl:
      "https://editorial.pxcrush.net/carsales/general/editorial/corolla-sedan-4.jpg?width=1024&height=682",
    emoji: "🚘",
    features: [
      "Premium Sedan",
      "2 min free wait",
      "Includes 1 km + 3 min",
      "Professional Service",
    ],
    country: "Uzbekistan",
    city: "Tashkent",
    currency: "UZS",
    originalBaseFare: 10800,
    originalPerKm: 2850,
    originalWaiting: 750,
  },
  {
    name: "Premier Class",
    type: "Premier",
    capacity: "4 passengers",
    baseFare: 1.21, // 15,500 sum ≈ $1.21 USD
    perKm: 0.30, // 3,900 sum/km ≈ $0.30 USD
    waitingCharge: 0.06, // 800 sum/min ≈ $0.06 USD
    imageUrl:
      "https://www.luxurycarrental.ae/storage/vehicles/April2024/oyNr3oQBRzxRD8FfRXmu.png",
    emoji: "🚙",
    features: [
      "Executive Sedan",
      "2 min free wait",
      "Includes 1 km + 3 min",
      "Top Luxury",
    ],
    country: "Uzbekistan",
    city: "Tashkent",
    currency: "UZS",
    originalBaseFare: 15500,
    originalPerKm: 3900,
    originalWaiting: 800,
  },

  // ========== KYRGYZSTAN (Bishkek - Yandex Go) ==========
  {
    name: "Economy Class",
    type: "Economy",
    capacity: "4 passengers",
    baseFare: 0.55, // 48 som ≈ $0.55 USD
    perKm: 0.10, // 8.5 som/km ≈ $0.10 USD
    waitingCharge: 0.06, // 5 som/min ≈ $0.06 USD
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-chevrolet-spark-mmp-1-1638552174.jpg?crop=0.997xw:0.751xh;0,0.138xh&resize=1200:*",
    emoji: "🚕",
    features: [
      "Compact/Hatchback",
      "3 min free wait",
      "City Travel",
      "Most Affordable",
    ],
    country: "Kyrgyzstan",
    city: "Bishkek",
    currency: "KGS",
    originalBaseFare: 48,
    originalPerKm: 8.5,
    originalWaiting: 5,
  },
  {
    name: "Comfort Class",
    type: "Comfort",
    capacity: "4 passengers",
    baseFare: 0.69, // 60 som ≈ $0.69 USD
    perKm: 0.12, // 10.5 som/km ≈ $0.12 USD
    waitingCharge: 0.07, // 6 som/min ≈ $0.07 USD
    imageUrl:
      "https://suzukipakistan.com/Media/Used-Cars/Product/15814073203.jpg",
    emoji: "🚗",
    features: [
      "Sedan",
      "3 min free wait",
      "Comfortable",
      "Popular Choice",
    ],
    country: "Kyrgyzstan",
    city: "Bishkek",
    currency: "KGS",
    originalBaseFare: 60,
    originalPerKm: 10.5,
    originalWaiting: 6,
  },
  {
    name: "Comfort+ Class",
    type: "Comfort+",
    capacity: "4 passengers",
    baseFare: 0.86, // 75 som ≈ $0.86 USD
    perKm: 0.15, // 13 som/km ≈ $0.15 USD
    waitingCharge: 0.07, // 6.5 som/min ≈ $0.07 USD
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-hyundai-accent-mmp-1-1634756931.jpg",
    emoji: "🚘",
    features: [
      "Larger Sedan",
      "3 min free wait",
      "Extra Space",
      "Good Value",
    ],
    country: "Kyrgyzstan",
    city: "Bishkek",
    currency: "KGS",
    originalBaseFare: 75,
    originalPerKm: 13,
    originalWaiting: 6.5,
  },
  {
    name: "Business Class",
    type: "Business",
    capacity: "4 passengers",
    baseFare: 0.92, // 80 som ≈ $0.92 USD
    perKm: 0.18, // 16 som/km ≈ $0.18 USD
    waitingCharge: 0.08, // 7 som/min ≈ $0.08 USD
    imageUrl:
      "https://editorial.pxcrush.net/carsales/general/editorial/corolla-sedan-4.jpg?width=1024&height=682",
    emoji: "🚙",
    features: [
      "Premium Sedan",
      "2 min free wait",
      "Professional Service",
      "Top Quality",
    ],
    country: "Kyrgyzstan",
    city: "Bishkek",
    currency: "KGS",
    originalBaseFare: 80,
    originalPerKm: 16,
    originalWaiting: 7,
  },

  // ========== TAJIKISTAN (Dushanbe - Maxim) ==========
  {
    name: "Economy Class",
    type: "Economy",
    capacity: "4 passengers",
    baseFare: 1.02, // SM 10.00 ≈ $1.02 USD
    perKm: 0.13, // SM 1.30/km ≈ $0.13 USD
    waitingCharge: 0.05, // 0.50 SM/min ≈ $0.05 USD
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Daewoo_Nexia_2013.JPG",
    emoji: "🚗",
    features: [
      "Compact/Sedan",
      "5 min free wait",
      "Includes 2.31 km",
      "Budget Friendly",
    ],
    country: "Tajikistan",
    city: "Dushanbe",
    currency: "TJS",
    originalBaseFare: 10.0,
    originalPerKm: 1.3,
    originalWaiting: 0.5,
  },
  {
    name: "Comfort Class",
    type: "Comfort",
    capacity: "4 passengers",
    baseFare: 1.53, // SM 15.00 ≈ $1.53 USD
    perKm: 0.16, // SM 1.60/km ≈ $0.16 USD
    waitingCharge: 0.05, // 0.50 SM/min ≈ $0.05 USD
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-hyundai-accent-mmp-1-1634756931.jpg",
    emoji: "🚘",
    features: [
      "Sedan",
      "5 min free wait",
      "Includes 3.0 km",
      "More Comfort",
    ],
    country: "Tajikistan",
    city: "Dushanbe",
    currency: "TJS",
    originalBaseFare: 15.0,
    originalPerKm: 1.6,
    originalWaiting: 0.5,
  },

  // ========== TURKMENISTAN (Ashgabat - 0555/Onlaýn taxi) ==========
  {
    name: "Standard Day (06:00-14:00)",
    type: "Standard",
    capacity: "4 passengers",
    baseFare: 1.20, // 7 TMT ≈ $1.20 USD (minimum trip 20 TMT = $3.43)
    perKm: 0.21, // 1.20 TMT/km ≈ $0.21 USD
    waitingCharge: 0.12, // 0.70 TMT/min ≈ $0.12 USD
    imageUrl:
      "https://suzukipakistan.com/Media/Used-Cars/Product/15814073203.jpg",
    emoji: "🚗",
    features: [
      "Day Tariff",
      "2 min free wait",
      "Min trip 20 TMT",
      "06:00-14:00",
    ],
    country: "Turkmenistan",
    city: "Ashgabat",
    currency: "TMT",
    originalBaseFare: 7.0,
    originalPerKm: 1.2,
    originalWaiting: 0.7,
    minimumTrip: 20.0,
  },
  {
    name: "Standard Evening (14:00-06:00)",
    type: "Standard Night",
    capacity: "4 passengers",
    baseFare: 1.54, // 9 TMT ≈ $1.54 USD (minimum trip 20 TMT = $3.43)
    perKm: 0.25, // 1.44 TMT/km ≈ $0.25 USD
    waitingCharge: 0.15, // 0.90 TMT/min ≈ $0.15 USD
    imageUrl:
      "https://www.autosbangla.com/images/suzuki/suzuki-wagon-r-img1.jpg",
    emoji: "🚙",
    features: [
      "Evening/Night Tariff",
      "2 min free wait",
      "Min trip 20 TMT",
      "14:00-06:00",
    ],
    country: "Turkmenistan",
    city: "Ashgabat",
    currency: "TMT",
    originalBaseFare: 9.0,
    originalPerKm: 1.44,
    originalWaiting: 0.9,
    minimumTrip: 20.0,
  },
  {
    name: "Student Tariff",
    type: "Student",
    capacity: "4 passengers",
    baseFare: 1.20, // 7 TMT ≈ $1.20 USD (minimum trip 20 TMT = $3.43)
    perKm: 0.34, // 2.00 TMT/km ≈ $0.34 USD
    waitingCharge: 0.15, // 0.90 TMT/min ≈ $0.15 USD
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-chevrolet-spark-mmp-1-1638552174.jpg?crop=0.997xw:0.751xh;0,0.138xh&resize=1200:*",
    emoji: "🚕",
    features: [
      "Student Discount",
      "2 min free wait",
      "Min trip 20 TMT",
      "Special Rate",
    ],
    country: "Turkmenistan",
    city: "Ashgabat",
    currency: "TMT",
    originalBaseFare: 7.0,
    originalPerKm: 2.0,
    originalWaiting: 0.9,
    minimumTrip: 20.0,
  },

  // ========== AZERBAIJAN (Baku - Maxim) ==========
  {
    name: "Economy Class",
    type: "Economy",
    capacity: "4 passengers",
    baseFare: 1.47, // 2.50 AZN ≈ $1.47 USD
    perKm: 0.41, // Average 0.70 AZN/km ≈ $0.41 USD (varies 0.20-0.95)
    waitingCharge: 0.03, // 0.05 AZN/min ≈ $0.03 USD
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-chevrolet-spark-mmp-1-1638552174.jpg?crop=0.997xw:0.751xh;0,0.138xh&resize=1200:*",
    emoji: "🚗",
    features: [
      "Hatchback/Small Sedan",
      "5 min free wait",
      "Includes 1.79 km",
      "Most Affordable",
    ],
    country: "Azerbaijan",
    city: "Baku",
    currency: "AZN",
    originalBaseFare: 2.5,
    originalPerKm: 0.7, // Average rate
    originalWaiting: 0.05,
    perKmRange: "0.20-0.95",
  },
  {
    name: "Comfort Class",
    type: "Comfort",
    capacity: "4 passengers",
    baseFare: 1.73, // 2.94 AZN ≈ $1.73 USD
    perKm: 0.42, // Average 0.72 AZN/km ≈ $0.42 USD (varies 0.22-0.97)
    waitingCharge: 0.03, // 0.05 AZN/min ≈ $0.03 USD
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-hyundai-accent-mmp-1-1634756931.jpg",
    emoji: "🚘",
    features: [
      "Sedan (More Comfort)",
      "5 min free wait",
      "Includes 1.74 km",
      "Popular Choice",
    ],
    country: "Azerbaijan",
    city: "Baku",
    currency: "AZN",
    originalBaseFare: 2.94,
    originalPerKm: 0.72, // Average rate
    originalWaiting: 0.05,
    perKmRange: "0.22-0.97",
  },
  {
    name: "Compact MPV (6 seats)",
    type: "SUV/MPV",
    capacity: "6 passengers",
    baseFare: 2.12, // 3.60 AZN ≈ $2.12 USD
    perKm: 0.74, // Average 1.26 AZN/km ≈ $0.74 USD (varies 0.36-1.71)
    waitingCharge: 0.06, // 0.10 AZN/min ≈ $0.06 USD
    imageUrl:
      "https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/body-image/public/images/car-reviews/first-drives/legacy/hyundai-tucson-2021-uk-fd-hero-front.jpg",
    emoji: "🚙",
    features: [
      "SUV/MPV",
      "5 min free wait",
      "Includes 1.07 km",
      "Extra Space",
    ],
    country: "Azerbaijan",
    city: "Baku",
    currency: "AZN",
    originalBaseFare: 3.6,
    originalPerKm: 1.26, // Average rate
    originalWaiting: 0.1,
    perKmRange: "0.36-1.71",
  },
  {
    name: "Minivan (7 seats)",
    type: "Van",
    capacity: "7 passengers",
    baseFare: 2.59, // 4.40 AZN ≈ $2.59 USD
    perKm: 0.91, // Average 1.54 AZN/km ≈ $0.91 USD (varies 0.44-2.09)
    waitingCharge: 0.06, // 0.10 AZN/min ≈ $0.06 USD
    imageUrl:
      "https://www.cars.com/i/large/in/v2/stock_photos/5b09f0e9-6f70-4b65-9c18-3f84db1cfb35/8d0a5a31-1fec-4ab5-b55c-93e8b9f0ff43.png",
    emoji: "🚐",
    features: [
      "Van/Large SUV",
      "5 min free wait",
      "Includes 1.07 km",
      "Group Travel",
    ],
    country: "Azerbaijan",
    city: "Baku",
    currency: "AZN",
    originalBaseFare: 4.4,
    originalPerKm: 1.54, // Average rate
    originalWaiting: 0.1,
    perKmRange: "0.44-2.09",
  },

  // ========== AZERBAIJAN (Baku - Street Taxi/Taximeter) ==========
  {
    name: "Street Taxi (Metered)",
    type: "Standard Metered",
    capacity: "4 passengers",
    baseFare: 1.00, // ~1.5-1.8 AZN average ≈ $1.00 USD
    perKm: 0.59, // 1.0 AZN/km ≈ $0.59 USD
    waitingCharge: 0.06, // ~0.10 AZN/min ≈ $0.06 USD
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Daewoo_Nexia_2013.JPG",
    emoji: "🚕",
    features: [
      "Traditional Taximeter",
      "Negotiate or Metered",
      "Widely Available",
      "Standard Service",
    ],
    country: "Azerbaijan",
    city: "Baku",
    currency: "AZN",
    originalBaseFare: 1.65, // Average of 1.5-1.8
    originalPerKm: 1.0,
    originalWaiting: 0.1,
  },
];

// Export the taxi fares data
module.exports = taxiFaresData;
