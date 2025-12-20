const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testRoutes() {
  console.log('🧪 Testing application routes...\n');
  
  const routes = [
    { name: 'Home', url: '/' },
    { name: 'Login', url: '/login' },
    { name: 'Signup', url: '/signup' },
    { name: 'Listings', url: '/listings' },
  ];
  
  for (const route of routes) {
    try {
      const response = await axios.get(BASE_URL + route.url, {
        validateStatus: () => true // Don't throw on any status
      });
      const status = response.status;
      const symbol = status === 200 ? '✅' : '⚠️';
      console.log(`${symbol} ${route.name}: ${status}`);
    } catch (error) {
      console.log(`❌ ${route.name}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Basic route testing complete!');
}

testRoutes();
