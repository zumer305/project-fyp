const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const LOCAL_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function exportData() {
    console.log('📦 Exporting MongoDB data...\n');
    
    try {
        await mongoose.connect(LOCAL_URL);
        console.log('✅ Connected to local MongoDB\n');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        const exportDir = './mongodb_export';
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir);
        }

        const allData = {};
        let totalDocs = 0;

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`📄 Exporting: ${collectionName}`);
            
            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();
            
            allData[collectionName] = documents;
            totalDocs += documents.length;
            
            // Save individual collection file
            const filePath = path.join(exportDir, `${collectionName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
            
            console.log(`   ✅ ${documents.length} documents exported to ${collectionName}.json`);
        }

        // Save combined file
        const combinedPath = path.join(exportDir, 'all_collections.json');
        fs.writeFileSync(combinedPath, JSON.stringify(allData, null, 2));

        console.log(`\n🎉 Export Complete!`);
        console.log(`📊 Total: ${totalDocs} documents from ${collections.length} collections`);
        console.log(`📁 Files saved to: ${exportDir}\n`);
        console.log(`📋 Next steps:`);
        console.log(`   1. Use MongoDB Compass to import these files to Atlas`);
        console.log(`   2. OR use the import script: node import-to-atlas.js`);

    } catch (error) {
        console.error('❌ Export failed:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
    }
}

exportData()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
