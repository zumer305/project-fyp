# 🗄️ MongoDB Atlas Setup Guide

## ❌ Current Issue
Your app is trying to connect to MongoDB but failing because:
- MongoDB is not installed locally
- No cloud database (MongoDB Atlas) is configured

## ✅ Solution: Use MongoDB Atlas (FREE Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email (FREE forever)
3. Choose "Free" tier (M0 Sandbox)

### Step 2: Create a Cluster
1. After signup, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select region closest to you (e.g., AWS / us-east-1)
4. Click **"Create Deployment"**

### Step 3: Create Database User
1. You'll see "Security Quickstart"
2. Create username: `wanderlust`
3. Create password: `wanderlust123` (or your own)
4. Click **"Create User"**

### Step 4: Add Your IP Address
1. In "Network Access" section
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Drivers"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://wanderlust:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Update Your .env File
1. Open `.env` file in your project
2. Find the line: `# MONGO_URL=your-mongodb-atlas-connection-string-here`
3. Replace it with:
   ```
   MONGO_URL=mongodb+srv://wanderlust:wanderlust123@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority
   ```
   (Use YOUR actual connection string)

### Step 7: Restart Your App
1. Stop the server (Ctrl+C in terminal)
2. Run: `node app.js`
3. You should see: ✅ Connected to MongoDB successfully

---

## 🎯 Quick Copy-Paste Example

Add this to your `.env` file (replace with YOUR connection string):

```env
MONGO_URL=mongodb+srv://wanderlust:wanderlust123@cluster0.mongodb.net/wanderlust?retryWrites=true&w=majority
```

---

## 🚀 After Setup

Once MongoDB is connected, you can:
- ✅ Sign up for accounts
- ✅ Log in to the website
- ✅ Create bookings
- ✅ Save listings
- ✅ Use all features

---

## 💡 Alternative: Local MongoDB

If you prefer local database:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
4. Your app will automatically connect to `mongodb://127.0.0.1:27017/wanderlust`

---

## ❓ Need Help?

- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- Connection String Format: https://www.mongodb.com/docs/manual/reference/connection-string/
