@echo off
echo ======================================
echo MongoDB Data Migration Script
echo ======================================
echo.
echo This script will:
echo 1. Export data from local MongoDB
echo 2. Import data to MongoDB Atlas
echo.

REM Check if mongodump exists
where mongodump >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: mongodump not found in PATH
    echo Please install MongoDB Database Tools from:
    echo https://www.mongodb.com/try/download/database-tools
    echo.
    pause
    exit /b 1
)

echo Step 1: Exporting data from local MongoDB...
mongodump --uri="mongodb://127.0.0.1:27017/wanderlust" --out="./mongodb_backup"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to export data
    pause
    exit /b 1
)

echo.
echo Step 2: Importing data to MongoDB Atlas...
echo.
echo IMPORTANT: Before running this step, ensure:
echo 1. Your IP is whitelisted in MongoDB Atlas Network Access
echo 2. Your database user has write permissions
echo.
pause

mongorestore --uri="mongodb+srv://zumerniaz305_db_user:ZLfPes6pj6R0YsS3@cluster0.vxif69z.mongodb.net/wanderlust?retryWrites=true&w=majority" ./mongodb_backup/wanderlust

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import data
    echo.
    echo Please check:
    echo - Your MongoDB Atlas credentials
    echo - Network access settings (IP whitelist)
    echo - Database user permissions
    pause
    exit /b 1
)

echo.
echo ======================================
echo Migration Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Update your .env file with the Atlas URL
echo 2. Restart your application
echo 3. Test your application
echo.
pause
