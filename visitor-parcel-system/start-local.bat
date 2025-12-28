@echo off
title Visitor System Launcher
echo ===================================================
echo   Starting Visitor & Parcel Management System
echo ===================================================

echo.
echo [1/2] Launching Backend Server...
start "Backend Server (Port 4000)" cmd /k "cd backend && npm install && npm run dev"

echo.
echo [2/2] Launching Frontend Application...
echo This may take a minute to compile...
start "Frontend App (Port 4200)" cmd /k "cd frontend && npm install && npm start"

echo.
echo ===================================================
echo   System is starting up!
echo   Frontend will open automatically at: http://localhost:4200
echo   Backend will run at: http://localhost:4000
echo ===================================================
pause
