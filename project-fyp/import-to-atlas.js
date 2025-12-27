const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { MongoClient } = require('mongodb');

const ATLAS_URL = 'mongodb+srv://zumerniaz305_db_user:ZLfPes6pj6R0YsS3@cluster0.vxif69z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'wanderlust';
const EXPORT_DIR = './mongodb_export';

async function importData() {
    console.log('📥 Importing data to MongoDB Atlas...\n');
    console.log('⚠️  Make sure you have:');
    console.log('   1. Whitelisted your IP in MongoDB Atlas Network Access');
    console.log('   2. Verified database user permissions\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    await new Promise(resolve => {
        rl.question('Press Enter to continue or Ctrl+C to cancel...', () => {
            rl.close();
            resolve();
        });
    });

    let client;

    try {
        console.log('\n☁️  Connecting to MongoDB Atlas...');
        client = new MongoClient(ATLAS_URL);
        await client.connect();
        const db = client.db(DB_NAME);
        console.log('✅ Connected to MongoDB Atlas\n');

        const files = fs.readdirSync(EXPORT_DIR).filter(f => f.endsWith('.json') && f !== 'all_collections.json');

        let totalDocs = 0;

        for (const file of files) {
            const collectionName = path.basename(file, '.json');
            console.log(`📦 Importing: ${collectionName}`);

            const filePath = path.join(EXPORT_DIR, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (data.length === 0) {
                console.log(`   ℹ️  Empty collection, skipping...\n`);
                continue;
            }

            const collection = db.collection(collectionName);

            // Clear existing data
            const deleteResult = await collection.deleteMany({});
            if (deleteResult.deletedCount > 0) {
                console.log(`   🗑️  Cleared ${deleteResult.deletedCount} existing documents`);
            }

            // Import data
            const result = await collection.insertMany(data);
            console.log(`   ✅ Imported ${result.insertedCount} documents\n`);
            totalDocs += result.insertedCount;
        }

        console.log('🎉 Import Complete!');
        console.log(`📊 Total: ${totalDocs} documents imported\n`);
        console.log('✅ Your data is now in MongoDB Atlas!');
        console.log('\n📋 Next steps:');
        console.log('   1. Update .env file: MONGO_URL=mongodb+srv://...');
        console.log('   2. Restart your application');
        console.log('   3. Test your application\n');

    } catch (error) {
        console.error('\n❌ Import failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check MongoDB Atlas Network Access (IP whitelist)');
        console.log('   2. Verify database user credentials');
        console.log('   3. Ensure cluster is running');
        console.log('   4. Try using MongoDB Compass instead\n');
        throw error;
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Connection closed');
        }
    }
}

importData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
