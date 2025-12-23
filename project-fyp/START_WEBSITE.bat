@echo off
cls
color 0A
title AI-Based Destination Explorer - Startup Script

echo ============================================================
echo           AI-Based Destination Explorer
echo              Travel Booking Website
echo ============================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    cls
    echo ============================================================
    echo     [ERROR] Node.js is NOT INSTALLED on your computer!
    echo ============================================================
    echo.
    echo This is why you're getting "nodemon is not recognized" error.
    echo.
    echo TO FIX THIS, FOLLOW THESE STEPS:
    echo.
    echo  STEP 1: Go to https://nodejs.org/
    echo.
    echo  STEP 2: Click the GREEN button that says "LTS"
    echo          (on the LEFT side)
    echo.
    echo  STEP 3: Install the downloaded file
    echo          (keep clicking Next)
    echo.
    echo  STEP 4: RESTART YOUR COMPUTER
    echo          (This is VERY important!)
    echo.
    echo  STEP 5: Run this file again
    echo.
    echo ============================================================
    echo.
    echo For detailed instructions with pictures, open this file:
    echo    READ_ME_FIRST.txt
    echo.
    echo Or check: INSTALL_INSTRUCTIONS.md
    echo.
    pause
    exit /b 1
)

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ============================================================
    echo     [ERROR] npm is not found!
    echo ============================================================
    echo.
    echo Please reinstall Node.js from: https://nodejs.org/
    echo Make sure to RESTART your computer after installation.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed!
node --version
echo.
echo [OK] npm is installed!
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    color 0E
    echo ============================================================
    echo   [INFO] First time setup - Installing dependencies...
    echo ============================================================
    echo.
    echo This will take 2-3 minutes. Please wait...
    echo.
    color 0A
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo.
        echo ============================================================
        echo     [ERROR] Failed to install dependencies!
        echo ============================================================
        echo.
        echo Try running this command manually:
        echo   npm install
        echo.
        pause
        exit /b 1
    )
    echo.
    color 0A
    echo [OK] All dependencies installed successfully!
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    color 0E
    echo ============================================================
    echo     [WARNING] .env configuration file not found!
    echo ============================================================
    echo.
    echo Your website might not work properly without configuration.
    echo Please create a .env file with your settings.
    echo.
    echo See .env.example for reference.
    echo.
    echo Press any key to continue anyway...
    pause >nul
    color 0A
)

cls
color 0B
echo ============================================================
echo            STARTING YOUR WEBSITE...
echo ============================================================
echo.
echo  Your website will be available at:
echo.
echo      http://localhost:3000
echo.
echo  What you'll see:
echo    - Modern deep ocean blue design
echo    - Coral accent buttons
echo    - Smooth animations
echo    - Professional cards
echo    - Glassmorphism navbar
echo.
echo  To STOP the server: Press Ctrl+C
echo.
echo ============================================================
echo.

REM Start the server with nodemon
color 0A
call npm run dev

REM If npm run dev fails, try node directly
if %ERRORLEVEL% NEQ 0 (
    echo.
    color 0E
    echo [INFO] Trying alternative start method...
    color 0A
    node app.js
)

echo.
color 0C
echo ============================================================
echo   Server stopped. Press any key to exit.
echo ============================================================
pause >nul
