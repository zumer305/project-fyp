const { MongoClient } = require('mongodb');

// Your local MongoDB connection
const LOCAL_URL = 'mongodb://127.0.0.1:27017/';
const LOCAL_DB_NAME = 'wanderlust';

// Your MongoDB Atlas connection
const ATLAS_URL = 'mongodb+srv://zumerniaz305_db_user:ZLfPes6pj6R0YsS3@cluster0.vxif69z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const ATLAS_DB_NAME = 'wanderlust';

async function migrateData() {
    console.log('🚀 Starting MongoDB Migration...\n');

    let localClient, atlasClient;

    try {
        // Connect to local MongoDB
        console.log('📥 Connecting to local MongoDB...');
        localClient = new MongoClient(LOCAL_URL);
        await localClient.connect();
        const localDb = localClient.db(LOCAL_DB_NAME);
        console.log('✅ Connected to local MongoDB\n');

        // Connect to MongoDB Atlas
        console.log('☁️  Connecting to MongoDB Atlas...');
        atlasClient = new MongoClient(ATLAS_URL);
        await atlasClient.connect();
        const atlasDb = atlasClient.db(ATLAS_DB_NAME);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Get all collections from local database
        const collections = await localDb.listCollections().toArray();
        let totalDocs = 0;

        // Migrate each collection
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`\n📦 Migrating collection: ${collectionName}`);

            // Get all documents from local collection
            const localCollection = localDb.collection(collectionName);
            const documents = await localCollection.find({}).toArray();

            if (documents.length === 0) {
                console.log(`   ℹ️  Collection is empty, skipping...`);
                continue;
            }

            console.log(`   📄 Found ${documents.length} documents`);

            // Insert into Atlas
            const atlasCollection = atlasDb.collection(collectionName);
            
            // Drop existing collection in Atlas to avoid duplicates
            try {
                await atlasCollection.drop();
                console.log(`   🗑️  Cleared existing data in Atlas`);
            } catch (err) {
                // Collection might not exist, that's okay
            }

            // Insert documents
            if (documents.length > 0) {
                await atlasCollection.insertMany(documents);
                console.log(`   ✅ Migrated ${documents.length} documents`);
                totalDocs += documents.length;
            }
        }

        console.log(`\n\n🎉 Migration Complete!`);
        console.log(`📊 Total documents migrated: ${totalDocs}`);
        console.log(`📦 Total collections migrated: ${collections.length}\n`);
        console.log(`⚠️  NEXT STEPS:`);
        console.log(`   1. Update your .env file with the Atlas URL`);
        console.log(`   2. Restart your application`);
        console.log(`   3. Test your application to ensure everything works\n`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        // Close connections
        if (localClient) await localClient.close();
        if (atlasClient) await atlasClient.close();
        console.log('🔌 Connections closed');
    }
}

// Run migration
migrateData()
    .then(() => {
        console.log('✅ Migration script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration script failed:', error);
        process.exit(1);
    });
