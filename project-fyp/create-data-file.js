const fs = require('fs');
const path = require('path');

const fileContent = `const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const getRandomImage = () => {
  const images = [
    "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1590735213920-68192a487bc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1580837119756-563d608dd119?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1512446670568-ea35d70cdd7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const generatePrice = (budgetLevel) => {
  const level = budgetLevel?.toLowerCase();
  if (level === 'budget') return Math.floor(Math.random() * 2000) + 800;
  if (level === 'luxury') return Math.floor(Math.random() * 5000) + 3000;
  return Math.floor(Math.random() * 2500) + 1500;
};

let sampleListings = [];

try {
  const csvPath = path.join(__dirname, '../dataset/central_asia_travel_dataset_500.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  const shuffled = records.sort(() => 0.5 - Math.random()).slice(0, 30);

  sampleListings = shuffled.map((record) => {
    const attractions = record.attractions ? record.attractions.split(';').map(a => a.trim()) : [];
    const mainAttraction = attractions[0] || record.city;
    
    const title = mainAttraction && mainAttraction !== record.city
      ? \`\${mainAttraction} - \${record.city}\`
      : \`\${record.city}, \${record.country}\`;
    
    let description = '';
    if (record.response && !record.response.includes('do you')) {
      description = record.response.substring(0, 200);
    } else {
      description = \`Discover \${record.city}, \${record.country}. \`;
      if (attractions.length > 0) {
        description += \`Attractions: \${attractions.slice(0, 3).join(', ')}. \`;
      }
      description += \`Best time: \${record.best_time}. Duration: \${record.suggested_days} days.\`;
    }
    
    return {
      title,
      description,
      image: { filename: "listingimage", url: getRandomImage() },
      price: generatePrice(record.budget_level),
      location: record.city,
      country: record.country
    };
  });

  console.log(\`Loaded \${sampleListings.length} Central Asian listings\`);
} catch (error) {
  console.error('CSV Error:', error.message);
  sampleListings = [
    {
      title: "Registan, Samarkand",
      description: "Experience the majestic Registan Square in Samarkand, Uzbekistan.",
      image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
      price: 2500,
      location: "Samarkand",
      country: "Uzbekistan"
    }
  ];
}

module.exports = { data: sampleListings };
`;

fs.writeFileSync(path.join(__dirname, 'init', 'data.js'), fileContent, 'utf-8');
console.log('data.js created successfully!');
