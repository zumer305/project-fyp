╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          🚨 NODE.JS IS NOT INSTALLED! 🚨                    ║
║                                                              ║
║  This is why you're getting the "nodemon is not recognized" ║
║  error. Follow these steps to fix it:                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


┌─────────────────────────────────────────────────────────────┐
│ STEP 1: DOWNLOAD NODE.JS                                    │
└─────────────────────────────────────────────────────────────┘

1. Open your web browser (Chrome, Edge, etc.)

2. Go to this website:
   👉 https://nodejs.org/

3. You'll see a page with TWO big green buttons:
   
   ┌─────────────────┐     ┌─────────────────┐
   │  20.10.0 LTS    │     │  21.5.0 Current │
   │  Recommended    │  ←  │     Latest      │
   └─────────────────┘     └─────────────────┘
        CLICK THIS!
   
4. Click the LEFT button (LTS - Recommended for Most Users)

5. A file will download (about 30 MB)
   File name: node-v20.10.0-x64.msi


┌─────────────────────────────────────────────────────────────┐
│ STEP 2: INSTALL NODE.JS                                     │
└─────────────────────────────────────────────────────────────┘

1. Go to your Downloads folder

2. Double-click the downloaded file: node-v20.10.0-x64.msi

3. You'll see installation wizard:
   
   ┌─────────────────────────────────────┐
   │  Welcome to Node.js Setup           │
   │                                     │
   │  [Next >]                           │
   └─────────────────────────────────────┘
   
   Click "Next"

4. Accept license agreement → Click "Next"

5. Choose install location (keep default) → Click "Next"

6. ⚠️ IMPORTANT: On the "Custom Setup" screen:
   Make sure ALL boxes are checked, including:
   ✅ Node.js runtime
   ✅ npm package manager
   ✅ Add to PATH
   ✅ Install necessary tools
   
   Click "Next"

7. Click "Install" (may ask for admin password)

8. Wait 2-3 minutes for installation

9. Click "Finish"


┌─────────────────────────────────────────────────────────────┐
│ STEP 3: RESTART YOUR COMPUTER                               │
└─────────────────────────────────────────────────────────────┘

⚠️ THIS IS VERY IMPORTANT! ⚠️

After installation completes:
1. Close all windows
2. Restart your computer
3. Without restart, Node.js won't work!


┌─────────────────────────────────────────────────────────────┐
│ STEP 4: VERIFY INSTALLATION (After Restart)                 │
└─────────────────────────────────────────────────────────────┘

1. Press Windows Key + R

2. Type: cmd

3. Press Enter (Command Prompt opens)

4. Type this command and press Enter:
   
   node --version
   
   You should see:
   v20.10.0
   
5. Type this command and press Enter:
   
   npm --version
   
   You should see:
   10.2.3 (or similar)

✅ If you see version numbers, Node.js is installed correctly!
❌ If you see "not recognized", restart your computer again.


┌─────────────────────────────────────────────────────────────┐
│ STEP 5: RUN YOUR WEBSITE                                    │
└─────────────────────────────────────────────────────────────┘

NOW you can run your website!

METHOD 1: Using Command Prompt
────────────────────────────────
1. Open Command Prompt (cmd)

2. Copy and paste this (press Enter after each):

   cd "C:\Users\Abubakar Laptop\Desktop\project-fyp\project-fyp"
   
   npm install
   
   (Wait 2-3 minutes for packages to install)
   
   npm run dev

3. Open browser: http://localhost:3000


METHOD 2: Using the Batch File (Easier!)
─────────────────────────────────────────
1. Go to folder:
   C:\Users\Abubakar Laptop\Desktop\project-fyp\project-fyp

2. Find file: START_WEBSITE.bat

3. Double-click it!

4. Website will start automatically!

5. Open browser: http://localhost:3000


┌─────────────────────────────────────────────────────────────┐
│ TROUBLESHOOTING                                              │
└─────────────────────────────────────────────────────────────┘

PROBLEM: Still getting "node is not recognized"
SOLUTION: 
  - You didn't restart your computer
  - Restart now and try again

PROBLEM: "npm install" shows errors
SOLUTION:
  - Make sure you're in the correct folder
  - Run: cd "C:\Users\Abubakar Laptop\Desktop\project-fyp\project-fyp"

PROBLEM: "Cannot find module"
SOLUTION:
  - Run: npm install
  - Wait for it to complete

PROBLEM: Port 3000 already in use
SOLUTION:
  - Close any programs using port 3000
  - Or press Ctrl+C and try again

PROBLEM: Website not loading
SOLUTION:
  - Check if terminal shows "Server running on port 3000"
  - Make sure browser is at: http://localhost:3000


┌─────────────────────────────────────────────────────────────┐
│ WHAT YOU SHOULD SEE                                          │
└─────────────────────────────────────────────────────────────┘

When you run "npm run dev", you should see:

[nodemon] 3.1.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node app.js`
Server is running on port 3000
MongoDB connected successfully
✨ Modern UI Enhancements Loaded Successfully!

Then open: http://localhost:3000

You'll see your beautiful new professional website with:
✨ Deep ocean blue colors
✨ Coral accent buttons
✨ Smooth animations
✨ Modern glassmorphism navbar
✨ Professional gradient cards


┌─────────────────────────────────────────────────────────────┐
│ SUMMARY - DO THIS NOW:                                       │
└─────────────────────────────────────────────────────────────┘

1. ✅ Go to: https://nodejs.org/
2. ✅ Download LTS version (left button)
3. ✅ Install it (keep clicking Next)
4. ✅ RESTART YOUR COMPUTER
5. ✅ Open Command Prompt
6. ✅ Run: cd "C:\Users\Abubakar Laptop\Desktop\project-fyp\project-fyp"
7. ✅ Run: npm install
8. ✅ Run: npm run dev
9. ✅ Open: http://localhost:3000
10. ✅ Enjoy your professional website!


Need help? Check these files in your project folder:
📄 INSTALL_INSTRUCTIONS.md
📄 HOW_TO_RUN.md
📄 START_WEBSITE.bat


Good luck! 🚀 Your website is going to look amazing!
