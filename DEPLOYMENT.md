# Deploy to Firebase Hosting + Cloud Run

This app uses Express + Socket.IO, which is best hosted on Cloud Run (supports WebSockets) behind Firebase Hosting for CDN, HTTPS, and custom domains.

## Prerequisites
- A Firebase project (create at https://console.firebase.google.com)
- Google Cloud project linked to Firebase
- Installed CLIs on Windows:
  - Node.js 18+ and npm
  - Firebase CLI: `npm i -g firebase-tools`
  - Google Cloud CLI: https://cloud.google.com/sdk/docs/install
- MongoDB accessible from Cloud Run (Atlas or public VM). Note your connection string.

## Configure environment
Set the following variables for Cloud Run:
- `MONGO_URL`: your MongoDB connection string
- `SESSION_SECRET`: any strong random string
- Optional email settings: `EMAIL_USER`, `EMAIL_PASSWORD` or `EMAIL_APP_PASSWORD`
- `APP_BASE_URL`: your Hosting URL (e.g., https://<your-site>.web.app)

You can set environment variables during `gcloud run deploy` using `--set-env-vars` or via the Cloud Console.

## Build & Deploy to Cloud Run
From the workspace root (`c:\Users\Hp\Desktop\fyp`):

```powershell
# Login once
firebase login
gcloud auth login

# Select project
firebase use <YOUR_FIREBASE_PROJECT_ID>
gcloud config set project <YOUR_GCLOUD_PROJECT_ID>

# Build container image and deploy service (us-central1 recommended)
gcloud builds submit --tag gcr.io/<YOUR_GCLOUD_PROJECT_ID>/project-fyp

gcloud run deploy project-fyp-service `
  --image gcr.io/<YOUR_GCLOUD_PROJECT_ID>/project-fyp `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars "MONGO_URL=<YOUR_MONGO_URL>,SESSION_SECRET=<YOUR_SECRET>,APP_BASE_URL=https://<your-site>.web.app"
```

Note: You can add email vars: `EMAIL_USER`, `EMAIL_PASSWORD`.

## Connect Firebase Hosting
`firebase.json` already contains a rewrite that sends all traffic to the Cloud Run service.
Deploy Hosting:

```powershell
firebase deploy --only hosting
```

This will publish static assets from `project-fyp/public` and proxy dynamic requests to `project-fyp-service` on Cloud Run.

## Verify
- Open your Hosting URL from the deploy output.
- Confirm pages render and Socket.IO connects (group chat).
- If MongoDB connection fails, check `MONGO_URL` and Cloud Run egress/network settings.

## Common Issues
- WebSockets failing: ensure you used Cloud Run (not Cloud Functions).
- 500 errors: check Cloud Run logs in Google Cloud Console.
- Static assets missing: confirm `public` path is `project-fyp/public`.

## Local Run
```powershell
cd project-fyp
npm install
npm start
```
Runs at http://localhost:8080. Ensure local MongoDB is available or set `MONGO_URL`.
