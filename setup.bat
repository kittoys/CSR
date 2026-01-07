@echo off
REM Startup Script untuk CSR Application (Windows)

color 0A
cls

echo ════════════════════════════════════════════════════
echo   CSR Monitoring System - Startup Script
echo ════════════════════════════════════════════════════
echo.

REM Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% detected

npm -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% detected
echo.

echo ════════════════════════════════════════════════════
echo   Step 1: Installing Backend Dependencies
echo ════════════════════════════════════════════════════
cd backend
if not exist "node_modules" (
    call npm install
) else (
    echo [OK] Dependencies already installed
)
echo.

echo ════════════════════════════════════════════════════
echo   Step 2: Installing Frontend Dependencies
echo ════════════════════════════════════════════════════
cd ..\frontend
if not exist "node_modules" (
    call npm install
) else (
    echo [OK] Dependencies already installed
)
cd ..
echo.

echo ════════════════════════════════════════════════════
echo   Setup Complete!
echo ════════════════════════════════════════════════════
echo.
echo To start the application, open 2 terminals:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo Then open: http://localhost:3000
echo Login: admin@csr.com / admin123
echo.
pause
