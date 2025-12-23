# 🔧 MongoDB Setup Guide - Choose Your Option

## ⚡ Quick Start: MongoDB Atlas (Cloud - RECOMMENDED)

**Why Atlas?**
- ✅ Free forever tier (no credit card needed)
- ✅ No installation required
- ✅ Works immediately
- ✅ Automatic backups
- ✅ Secure and fast

### Steps:

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster**
   - Click "Build a Database"
   - Select **FREE** tier (M0 Sandbox)
   - Choose a region (closest to you)
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `fyp_user`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: Select "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access From Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://fyp_user:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password from step 3
   - Replace `<db_name>` with `wanderlust`

6. **Update Your .env File**
   ```
   MONGO_URL=mongodb+srv://fyp_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority
   ```

7. **Restart Your App**
   ```
   Ctrl+C (stop server)
   node app.js (start again)
   ```

✅ **Done!** Your app is now connected to MongoDB Atlas!

---

## 🖥️ Option 2: Local MongoDB (Advanced Users)

**Only choose this if you:**
- Want to work offline
- Need local development environment
- Are comfortable with system administration

### Steps:

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select your OS: Windows
   - Download and run installer

2. **Install with Default Settings**
   - Run the installer
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Run service as Network Service user"
   - Keep default data directory: `C:\Program Files\MongoDB\Server\8.0\data`
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   # As Administrator
   net start MongoDB
   ```

5. **Update .env File**
   ```
   MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
   ```

6. **Restart Your App**
   ```
   node app.js
   ```

---

## 🚨 Troubleshooting

### Problem: "mongod is not recognized"
**Solution**: MongoDB isn't in PATH
```powershell
# Add to PATH (as Administrator)
$env:Path += ";C:\Program Files\MongoDB\Server\8.0\bin"
```

### Problem: "MongoDB service not starting"
**Solution 1**: Start manually
```powershell
# As Administrator
net start MongoDB
```

**Solution 2**: Use our startup script
```
Double-click: start-mongodb.bat
```

### Problem: "Connection timeout"
**Solution**: Check if MongoDB is running
```powershell
Get-Process mongod -ErrorAction SilentlyContinue
```

### Problem: "Authentication failed"
**Solution**: Your Atlas password is wrong
- Go to Atlas → Database Access
- Click "Edit" on your user
- Click "Edit Password"
- Generate new password
- Update .env with new password

---

## ✅ How to Know It's Working

When you start your app with `node app.js`, you should see:

```
✅ Connected to MongoDB successfully
✅ Seeded 50 listings from init/data.js
App is listening on port 8080
```

**Instead of:**
```
❌ MongoDB Connection Failed!
Error: connect ECONNREFUSED 127.0.0.1:27017
```

---

## 📊 Using MongoDB Compass (Optional)

MongoDB Compass is a GUI tool to view your database:

1. Download: https://www.mongodb.com/try/download/compass
2. Install and open
3. Connect using your connection string
4. Browse collections, view documents, run queries

---

## 🎯 Recommended Setup for Students

**For FYP Project:**
- ✅ Use MongoDB Atlas (free, no setup hassle)
- ✅ Create backup connection string (in case of issues)
- ✅ Keep your password in a safe place
- ✅ Enable IP whitelist for security

**Benefits:**
- Works from anywhere (home, university, coffee shop)
- No installation issues
- Automatic backups
- Professional cloud setup for your portfolio

---

## 💡 Quick Commands

### Stop MongoDB (Local)
```powershell
net stop MongoDB
```

### Restart MongoDB (Local)
```powershell
net stop MongoDB
net start MongoDB
```

### Check MongoDB Status (Local)
```powershell
Get-Service MongoDB
```

### Test Connection
```powershell
mongo
# or
mongosh
```

---

## 🆘 Still Having Issues?

1. **Check your .env file**
   - Is MONGO_URL uncommented (no # at start)?
   - Is the connection string correct?
   - Is password correct (no < > brackets)?

2. **Check firewall**
   - Windows Firewall might block MongoDB
   - Atlas: Make sure 0.0.0.0/0 is whitelisted

3. **Restart everything**
   ```powershell
   # Stop app (Ctrl+C)
   # Restart MongoDB service
   net stop MongoDB
   net start MongoDB
   # Start app
   node app.js
   ```

4. **Use our helper script**
   ```
   Double-click: start-mongodb.bat
   ```

---

**Need More Help?**
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- MongoDB Community: https://www.mongodb.com/community/forums/
- Stack Overflow: Tag your question with `mongodb`

Good luck! 🚀
