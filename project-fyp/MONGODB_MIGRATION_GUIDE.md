# MongoDB Atlas Migration Guide

## Current Status
✅ **Data Exported**: 264 documents from 10 collections  
✅ **Export Location**: `./mongodb_export/`  
✅ **ENV Updated**: MongoDB Atlas URL added to .env  
❌ **Connection Issue**: SSL error with Node.js v22 and MongoDB Atlas

---

## SOLUTION 1: MongoDB Compass (RECOMMENDED - EASIEST) ⭐

### Step 1: Download MongoDB Compass
- Download from: https://www.mongodb.com/try/download/compass
- Install and open MongoDB Compass

### Step 2: Export from Local MongoDB
1. In Compass, connect to: `mongodb://127.0.0.1:27017`
2. Select database: `wanderlust`
3. **OR** you can skip this - data is already exported to `./mongodb_export/`

### Step 3: Connect to MongoDB Atlas
1. In Compass, click "New Connection"
2. Paste: `mongodb+srv://zumerniaz305_db_user:ZLfPes6pj6R0YsS3@cluster0.vxif69z.mongodb.net/`
3. Click "Connect"

### Step 4: Import Data
For each collection (users, listings, bookings, etc.):
1. Select database: `wanderlust`
2. Create collection (if doesn't exist)
3. Click "Add Data" → "Import JSON or CSV file"
4. Select the file from `mongodb_export/` folder
5. Click "Import"

**Collections to import:**
- users.json (8 documents)
- listings.json (14 documents)
- bookings.json (18 documents)
- groups.json (3 documents)
- messages.json (15 documents)
- reviews.json (5 documents)
- taxifares.json (21 documents)
- travelpackages.json (180 documents)

---

## SOLUTION 2: Fix MongoDB Atlas & Use Scripts

### Prerequisites
1. **Whitelist Your IP**:
   - Go to: https://cloud.mongodb.com
   - Click: Network Access → Add IP Address
   - Add: `0.0.0.0/0` (allow from anywhere)
   - Wait 2-3 minutes

2. **Verify Database User**:
   - Click: Database Access
   - User: `zumerniaz305_db_user`
   - Password: `ZLfPes6pj6R0YsS3`
   - Role: Atlas admin or readWrite

3. **Check Cluster Status**:
   - Make sure your cluster is not paused

### Then Run:
```
node import-to-atlas.js
```

---

## SOLUTION 3: Use mongorestore Command

### Install MongoDB Database Tools
Download from: https://www.mongodb.com/try/download/database-tools

### Run:
```
mongorestore --uri="mongodb+srv://zumerniaz305_db_user:ZLfPes6pj6R0YsS3@cluster0.vxif69z.mongodb.net/wanderlust" ./mongodb_export/
```

---

## After Migration Complete

### 1. Test Connection
```
node test-atlas-connection.js
```

### 2. Restart Your Application
```
npm start
```

### 3. Switch Back to Local (if needed)
Edit `.env` file and comment/uncomment the URLs:
```env
# Use Atlas
MONGO_URL=mongodb+srv://zumerniaz305_db_user:...

# OR use Local
# MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
```

---

## Troubleshooting

### SSL Error (current issue)
**Cause**: Node.js v22 has OpenSSL 3.x which has compatibility issues with some MongoDB Atlas configurations  
**Solutions**:
1. Use MongoDB Compass (GUI tool)
2. Whitelist IP in Atlas Network Access
3. Downgrade to Node.js v18 or v20 (if needed)

### Connection Timeout
- Check internet connection
- Verify IP is whitelisted
- Check if cluster is paused

### Authentication Failed
- Verify username: `zumerniaz305_db_user`
- Verify password: `ZLfPes6pj6R0YsS3`
- Check user permissions in Database Access

---

## Files Created
- ✅ `export-local-data.js` - Export from local MongoDB
- ✅ `import-to-atlas.js` - Import to MongoDB Atlas
- ✅ `test-atlas-connection.js` - Test connection
- ✅ `migrate-to-atlas.js` - Full migration script
- ✅ `migrate-mongodb.bat` - Batch file for migration
- ✅ `mongodb_export/` - Your exported data (264 documents)
