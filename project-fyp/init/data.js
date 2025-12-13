// const sampleListings = [
//   {
//     title: "Cozy Beachfront Cottage",
//     description:
//       "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//     image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1500,
//     location: "Malibu",
//     country: "United States",
//   },
//   {
//     title: "Modern Loft in Downtown",
//     description:
//       "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
//     image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1200,
//     location: "New York City",
//     country: "United States",
//   },
//   {
//     title: "Mountain Retreat",
//     description:
//       "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
//     image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1000,
//     location: "Aspen",
//     country: "United States",
//   },
//   {
//     title: "Historic Villa in Tuscany",
//     description:
//       "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
//     image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 2500,
//     location: "Florence",
//     country: "Italy",
//   },
//   {
//     title: "Secluded Treehouse Getaway",
//     description:
//       "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
//     image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 800,
//     location: "Portland",
//     country: "United States",
//   },
//   {
//     title: "Beachfront Paradise",
//     description:
//       "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
//     image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 2000,
//     location: "Cancun",
//     country: "Mexico",
//   },
//   {
//     title: "Rustic Cabin by the Lake",
//     description:
//       "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
//     image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 900,
//     location: "Lake Tahoe",
//     country: "United States",
//   },
//   {
//     title: "Luxury Penthouse with City Views",
//     description:
//       "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
//     image: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 3500,
//     location: "Los Angeles",
//     country: "United States",
//   },
//   {
//     title: "Ski-In/Ski-Out Chalet",
//     description:
//       "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
//     image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 3000,
//     location: "Verbier",
//     country: "Switzerland",
//   },
//   {
//     title: "Safari Lodge in the Serengeti",
//     description:
//       "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
//     image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 4000,
//     location: "Serengeti National Park",
//     country: "Tanzania",
//   },
//   {
//     title: "Historic Canal House",
//     description:
//       "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
//     image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1800,
//     location: "Amsterdam",
//     country: "Netherlands",
//   },
//   {
//     title: "Private Island Retreat",
//     description:
//       "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
//     image: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 10000,
//     location: "Fiji",
//     country: "Fiji",
//   },
//   {
//     title: "Charming Cottage in the Cotswolds",
//     description:
//       "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
//     image: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1200,
//     location: "Cotswolds",
//     country: "United Kingdom",
//   },
//   {
//     title: "Historic Brownstone in Boston",
//     description:
//       "Step back in time in this elegant historic brownstone located in the heart of Boston.",
//     image: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 2200,
//     location: "Boston",
//     country: "United States",
//   },
//   {
//     title: "Beachfront Bungalow in Bali",
//     description:
//       "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
//     image: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1800,
//     location: "Bali",
//     country: "Indonesia",
//   },
//   {
//     title: "Mountain View Cabin in Banff",
//     description:
//       "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
//     image: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1500,
//     location: "Banff",
//     country: "Canada",
//   },
//   {
//     title: "Art Deco Apartment in Miami",
//     description:
//       "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
//     image: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1600,
//     location: "Miami",
//     country: "United States",
//   },
//   {
//     title: "Tropical Villa in Phuket",
//     description:
//       "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
//     image: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 3000,
//     location: "Phuket",
//     country: "Thailand",
//   },
//   {
//     title: "Historic Castle in Scotland",
//     description:
//       "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
//     image: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 4000,
//     location: "Scottish Highlands",
//     country: "United Kingdom",
//   },
//   {
//     title: "Desert Oasis in Dubai",
//     description:
//       "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
//     image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 5000,
//     location: "Dubai",
//     country: "United Arab Emirates",
//   },
//   {
//     title: "Rustic Log Cabin in Montana",
//     description:
//       "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
//     image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1100,
//     location: "Montana",
//     country: "United States",
//   },
//   {
//     title: "Beachfront Villa in Greece",
//     description:
//       "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
//     image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 2500,
//     location: "Mykonos",
//     country: "Greece",
//   },
//   {
//     title: "Eco-Friendly Treehouse Retreat",
//     description:
//       "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
//     image: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 750,
//     location: "Costa Rica",
//     country: "Costa Rica",
//   },
//   {
//     title: "Historic Cottage in Charleston",
//     description:
//       "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
//     image: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1600,
//     location: "Charleston",
//     country: "United States",
//   },
//   {
//     title: "Modern Apartment in Tokyo",
//     description:
//       "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
//     image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 2000,
//     location: "Tokyo",
//     country: "Japan",
//   },
//   {
//     title: "Lakefront Cabin in New Hampshire",
//     description:
//       "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
//     image: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1200,
//     location: "New Hampshire",
//     country: "United States",
//   },
//   {
//     title: "Luxury Villa in the Maldives",
//     description:
//       "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
//     image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 6000,
//     location: "Maldives",
//     country: "Maldives",
//   },
//   {
//     title: "Ski Chalet in Aspen",
//     description:
//       "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
//     image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 4000,
//     location: "Aspen",
//     country: "United States",
//   },
//   {
//     title: "Secluded Beach House in Costa Rica",
//     description:
//       "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
//     image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     price: 1800,
//     location: "Costa Rica",
//     country: "Costa Rica",
//   },
// ];

// module.exports = { data: sampleListings };
const sampleListings = [

    {
    title: "Azerbaijan",
    description:
      "Baku, the capital of Azerbaijan, is a significant economic and administrative center located on the western shore of the Caspian Sea.",
    image: {
      filename: "listingimage",
      url: "https://www.mywanderlust.pl/wp-content/uploads/2019/12/visit-baku-azerbaijan-pictures-35.jpg",
    },
    price: 400000,
    location: "Baku",
    country: "Azerbaijan",
  },
    {
    title: "Azerbaijan",
    description:
      "The people of Red Village are known for their rich cultural heritage and their dedication to preserving their traditions. ",
    image: {
      filename: "listingimage",
      url: "https://mir-s3-cdn-cf.behance.net/project_modules/source/1b482345490087.5832f91ce172c.jpg",
    },
    price: 500000,
    location: "Red Village",
    country: "Azerbaijan",
  },
     {
    title: "Azerbaijan",
    description:
      "The name Sabran is of Hebrew origin, meaning patient or enduring. It is derived from the Hebrew word savlanut which translates to patience.",
    image: {
      filename: "listingimage",
      url: "https://www.beyond.fr/picsvill2/sabran0002b.jpg",
    },
    price: 600000,
    location: "Sabran",
    country: "Azerbaijan",
  },





  {
    title: "Kazakhstan",
    description:
      "Aktau is one of the most fascinating and unusual cities in Kazakhstan. Its name is translated from Kazakh as the white mountain.",
    image: {
      filename: "listingimage",
      url: "https://stantrips.com/assets/img/sights-kz/aktau/aktau.jpg",
    },
    price: 700000,
    location: "Aktau",
    country: "Kazakhstan",
  },
    {
    title: "Kazakhstan",
    description:
      "The Almaty region in western Kyrgyzstan is famous for its long and rich history, wild walnut forests, green expanses, and pristine nature.",
    image: {
      filename: "listingimage",
      url: "https://www.remotelands.com/storage/media/1569/conversions/b140723034-banner-size.jpg",
    },
    price: 900000,
    location: "Almaty",
    country: "Kazakhstan",
  },
   {
    title: "Kazakhstan",
    description:
      "Atyrau is famous for its oil and gas industries.",
    image: {
      filename: "listingimage",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtJU19ojHavkQd_JlxdYiO-PwvJrAxonCbpA&s",
    },
    price: 500000,
    location: "Atyrau",
    country: "Kazakhstan",
  },




   {
    title: "Kyrgyzstan",
    description:
      "The Almaty region in western Kyrgyzstan is famous for its long and rich history, wild walnut forests, green expanses, and pristine nature.",
    image: {
      filename: "listingimage",
      url: "https://eurasia.travel/wp-content/uploads/2024/09/Jalal-Abad-Kyrgyzstan-4.jpg",
    },
    price: 100000,
    location: "Jalal-Abad",
    country: "Kyrgyzstan",
  },
  {
    title: "Kyrgyzstan",
    description:
      "Bishkek, formerly known as Pishpek (until 1926), and then Frunze (1926–1991), is the capital and largest urban city of Kyrgyzstan. ",
    image: {
      filename: "listingimage",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Bishkek_City%27s_business_center.jpg/1200px-Bishkek_City%27s_business_center.jpg",
    },
    price: 500000,
    location: "Bishkek",
    country: "Kyrgyzstan",
  },







    {
    title: "Tajikistan",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Rudaki_Tomb_in_Panjkent-after_restored.jpg/250px-Rudaki_Tomb_in_Panjkent-after_restored.jpg",
    },
    price: 600000,
    location: "Panjakent",
    country: "Tajikistan",
  },
    {
    title: "Tajikistan",
    description:
      "Dushanbe is a clean, European-style city. The city is located in Gisar valley at 2,700 ft above sea level, and has wide tree-lined streets with plenty of cafés to enjoy coffee or tea with local sweets. ",
    image: {
      filename: "listingimage",
      url: "https://media.tacdn.com/media/attractions-splice-spp-674x446/0f/dd/17/4b.jpg",
    },
    price: 500000,
    location: "Dushanbe",
    country: "Tajikistan",
  },
    {
    title: "Tajikistan",
    description:
      "Khujand is one of the oldest cities in Central Asia, dating back about 2,500 years to the Persian Empire.",
    image: {
      filename: "listingimage",
      url: "https://media.istockphoto.com/id/1483621207/photo/the-medieval-khujand-fortress.jpg?s=612x612&w=0&k=20&c=u1MS_m8JgQjKsJcELxPnfYfOIRiRDuqTm3TZx9LizgQ=",
    },
    price: 700000,
    location: "Khujand",
    country: "Tajikistan",
  },












  {
    title: "Uzbekistan",
    description:
      "Toshkent or Tashkent city lies in eastern Uzbekistan and is the capital of the country. ",
    image: {
      filename: "listingimage",
      url: "https://media.istockphoto.com/id/1572635966/photo/aerial-panorama-view-of-the-chorsu-market-in-tashkent-uzbekistan.jpg?s=612x612&w=0&k=20&c=g0ojUlC401tAiGXjt4rv-ZukP1XqZtpuCNW_aVuAqM4=",
    },
    price: 600000,
    location: "Tashkent",
    country: "Uzbekistan",
  },

 
 

  {
    title: "Turkmenistan",
    description:
      "The port-city of Turkmenbashi (formerly Krasnovodsk) is the only major port in the entire Central Asia.",
    image: {
      filename: "listingimage",
      url: "https://trvlland.com/wp-content/uploads/2022/09/uzbekistan_tashkent-3-1024x663.jpg",
    },
    price: 700000,
    location: "Turkmenbashi",
    country: "Turkmenistan",
  },
  {
    title: "Turkmenistan",
    description:
      "Ashgabat – white marbled capital of the independent and neutral Turkmenistan, as well as the recognized pearl of the Central Asia.",
    image: {
      filename: "listingimage",
      url: "https://thumbs.dreamstime.com/b/monument-independence-ashgabat-statues-around-capital-city-turkmenistan-48560121.jpg",
    },
    price: 40000,
    location: "Ashgabat",
    country: "Turkmenistan",
  },

 
 

 


  // ... (same pattern continues for all other listings)
];

module.exports = { data: sampleListings };
