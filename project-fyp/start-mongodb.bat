@echo off
echo ============================================
echo MongoDB Local Server Startup
echo ============================================
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: MongoDB is not installed or not in PATH!
    echo.
    echo Please choose one of these options:
    echo.
    echo Option 1: Install MongoDB Community Server
    echo   1. Download from: https://www.mongodb.com/try/download/community
    echo   2. Install with default settings
    echo   3. MongoDB will be added to PATH automatically
    echo.
    echo Option 2: Use MongoDB Atlas ^(Cloud - Recommended^)
    echo   1. Go to: https://www.mongodb.com/cloud/atlas/register
    echo   2. Create a free cluster ^(no credit card needed^)
    echo   3. Get your connection string
    echo   4. Update .env file: MONGO_URL=mongodb+srv://your-connection-string
    echo.
    pause
    exit /b 1
)

echo Found MongoDB installation!
echo.

REM Create data directory if it doesn't exist
if not exist "%CD%\mongodb-data" (
    echo Creating data directory...
    mkdir "%CD%\mongodb-data"
    echo Created: %CD%\mongodb-data
    echo.
)

echo Starting MongoDB server...
echo Data directory: %CD%\mongodb-data
echo Port: 27017
echo.
echo MongoDB is starting... ^(Press Ctrl+C to stop^)
echo.

REM Start MongoDB with custom data directory
mongod --dbpath "%CD%\mongodb-data" --port 27017

pause
