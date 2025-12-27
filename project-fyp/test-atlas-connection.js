const { MongoClient } = require('mongodb');

const ATLAS_URL = 'mongodb+srv://zumerniaz305_db_user:ZLfPes6pj6R0YsS3@cluster0.vxif69z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
    console.log('🔍 Testing MongoDB Atlas connection...\n');
    
    const client = new MongoClient(ATLAS_URL, {
        serverSelectionTimeoutMS: 5000,
    });

    try {
        console.log('Connecting...');
        await client.connect();
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        const admin = client.db().admin();
        const info = await admin.serverStatus();
        console.log(`MongoDB version: ${info.version}`);
        console.log(`Host: ${info.host}`);
        
        return true;
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n🔧 Common causes:');
        console.log('   1. IP not whitelisted - Go to MongoDB Atlas → Network Access → Add IP');
        console.log('   2. Wrong credentials - Verify username/password');
        console.log('   3. Cluster paused - Check cluster status in Atlas');
        console.log('   4. SSL/TLS issue with Node.js v22\n');
        return false;
    } finally {
        await client.close();
    }
}

testConnection()
    .then(success => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
