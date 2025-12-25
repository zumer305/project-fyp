# Deploy to Render.com

## Step 1: Prepare Your Code ✅
- [x] MongoDB migrated to Atlas
- [x] render.yaml created
- [x] .gitignore created
- [ ] Code pushed to GitHub

## Step 2: Push to GitHub

### If you don't have a GitHub repository yet:

1. Go to https://github.com and sign in
2. Click "New Repository"
3. Name: `wanderlust-project` (or any name)
4. Keep it **Private** or **Public**
5. **Don't** initialize with README
6. Click "Create repository"

### Push your code:

```powershell
cd C:\Users\Hp\Desktop\fyp\project-fyp

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for Render deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/wanderlust-project.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Render.com

### Create Account:
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)

### Deploy Web Service:
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `wanderlust-project`
3. Click "Connect"

### Configure Service:
- **Name**: `wanderlust-backend` (or any name)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### Add Environment Variables:
Click "Advanced" → "Add Environment Variable" and add these:

```
MONGO_URL = mongodb+srv://zumerniaz305_db_user:ZLfPes6pj6R0YsS3@cluster0.vxif69z.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0

SESSION_SECRET = thisisasupersecretkey12345

CLOUD_NAME = dn26zdzex
CLOUD_API_KEY = 384445432746164
CLOUD_API_SECRET = QAK4CdQrAMEjJnqGTgRP5v0dVS4

EVENTBRITE_TOKEN = FJPT53WY5JPIH2CXANM2

EMAIL_USER = ai.based.destination.explorer@gmail.com
EMAIL_PASSWORD = cvtq yoql pfsy omlr

ADMIN_EMAIL = ai.based.destination.explorer@gmail.com

NODE_ENV = production
```

### Deploy:
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://wanderlust-backend.onrender.com`

## Step 4: Update Frontend

Once deployed, update your frontend to use the new URL:
- Change `http://localhost:8080` to `https://wanderlust-backend.onrender.com`

## Troubleshooting

### Build Fails:
- Check logs in Render dashboard
- Verify all dependencies in package.json

### App Crashes:
- Check "Logs" tab in Render dashboard
- Verify all environment variables are set

### Database Connection Issues:
- Verify MongoDB Atlas connection string
- Check if your IP is whitelisted (use 0.0.0.0/0 for Render)

## Free Tier Limitations:
- App sleeps after 15 minutes of inactivity
- Cold start takes ~30 seconds
- 750 hours/month free (enough for 24/7)
- Automatically wakes up when accessed

## Upgrade to Paid ($7/month):
- No sleep
- Better performance
- Custom domains
