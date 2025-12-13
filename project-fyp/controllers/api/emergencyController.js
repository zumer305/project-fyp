// Emergency contacts API for Central Asian countries
const emergencyData = {
  Azerbaijan: {
    country: "Azerbaijan",
    police: "102",
    ambulance: "103",
    fire: "101",
    emergency: "112",
    hospitals: [
      {
        name: "Central Clinical Hospital",
        city: "Baku",
        phone: "+994 12 493 24 41",
        address: "Nobel Avenue 20, Baku"
      },
      {
        name: "Baku Medical Plaza",
        city: "Baku",
        phone: "+994 12 404 10 10",
        address: "Tbilisi Avenue 1, Baku"
      }
    ],
    embassy: {
      name: "Pakistan Embassy",
      city: "Baku",
      phone: "+994 12 497 22 47",
      address: "Ahmed Rajabli Street 7, Baku"
    }
  },
  Kazakhstan: {
    country: "Kazakhstan",
    police: "102",
    ambulance: "103",
    fire: "101",
    emergency: "112",
    hospitals: [
      {
        name: "National Research Center",
        city: "Almaty",
        phone: "+7 727 279 88 00",
        address: "Dostyk Avenue 13, Almaty"
      },
      {
        name: "City Clinical Hospital №7",
        city: "Almaty",
        phone: "+7 727 378 67 69",
        address: "Satpayev Street 24, Almaty"
      }
    ],
    embassy: {
      name: "Pakistan Embassy",
      city: "Astana",
      phone: "+7 717 292 23 82",
      address: "Kosmonavtov Street 62, Astana"
    }
  },
  Kyrgyzstan: {
    country: "Kyrgyzstan",
    police: "102",
    ambulance: "103",
    fire: "101",
    emergency: "112",
    hospitals: [
      {
        name: "National Hospital",
        city: "Bishkek",
        phone: "+996 312 66 24 39",
        address: "Akhunbaev Street 92, Bishkek"
      },
      {
        name: "Republican Clinical Hospital",
        city: "Bishkek",
        phone: "+996 312 62 34 45",
        address: "Bokonbaev Street 137, Bishkek"
      }
    ],
    embassy: {
      name: "Pakistan Embassy",
      city: "Bishkek",
      phone: "+996 312 66 41 31",
      address: "Razzakov Street 35, Bishkek"
    }
  },
  Tajikistan: {
    country: "Tajikistan",
    police: "102",
    ambulance: "103",
    fire: "101",
    emergency: "112",
    hospitals: [
      {
        name: "Republican Clinical Hospital",
        city: "Dushanbe",
        phone: "+992 37 221 20 03",
        address: "Ismoili Somoni Avenue 59, Dushanbe"
      },
      {
        name: "Dushanbe Medical Center",
        city: "Dushanbe",
        phone: "+992 37 227 80 00",
        address: "Rudaki Avenue 139, Dushanbe"
      }
    ],
    embassy: {
      name: "Pakistan Embassy",
      city: "Dushanbe",
      phone: "+992 37 221 51 62",
      address: "Ismoili Somoni Avenue 36, Dushanbe"
    }
  },
  Turkmenistan: {
    country: "Turkmenistan",
    police: "102",
    ambulance: "103",
    fire: "101",
    emergency: "112",
    hospitals: [
      {
        name: "State Medical Center",
        city: "Ashgabat",
        phone: "+993 12 39 36 77",
        address: "Magtymguly Avenue 84, Ashgabat"
      },
      {
        name: "Ashgabat Medical Complex",
        city: "Ashgabat",
        phone: "+993 12 44 52 00",
        address: "Archabil Avenue 56, Ashgabat"
      }
    ],
    embassy: {
      name: "Pakistan Embassy",
      city: "Ashgabat",
      phone: "+993 12 39 45 04",
      address: "Pushkin Street 15, Ashgabat"
    }
  },
  Uzbekistan: {
    country: "Uzbekistan",
    police: "102",
    ambulance: "103",
    fire: "101",
    emergency: "112",
    hospitals: [
      {
        name: "Republican Scientific Center of Emergency Medical Care",
        city: "Tashkent",
        phone: "+998 71 150 07 77",
        address: "Farkhad Street 2, Tashkent"
      },
      {
        name: "Tashkent Medical Academy Clinic",
        city: "Tashkent",
        phone: "+998 71 244 45 67",
        address: "Farobiy Street 2, Tashkent"
      }
    ],
    embassy: {
      name: "Pakistan Embassy",
      city: "Tashkent",
      phone: "+998 71 140 58 91",
      address: "Oybek Street 35, Tashkent"
    }
  }
};

// Get emergency contacts by country
exports.getEmergencyContacts = (req, res) => {
  try {
    const { country } = req.params;
    
    const data = emergencyData[country];
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Emergency contacts not found for ${country}`
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching emergency contacts",
      error: error.message
    });
  }
};

// Get all emergency contacts
exports.getAllEmergencyContacts = (req, res) => {
  try {
    res.json({
      success: true,
      data: emergencyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching emergency contacts",
      error: error.message
    });
  }
};
