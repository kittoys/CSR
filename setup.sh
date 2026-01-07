#!/bin/bash
# Startup Script untuk CSR Application

echo "════════════════════════════════════════════════════"
echo "  🚀 CSR Monitoring System - Startup Script"
echo "════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

echo "════════════════════════════════════════════════════"
echo "  📦 Step 1: Installing Backend Dependencies"
echo "════════════════════════════════════════════════════"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi
echo ""

echo "════════════════════════════════════════════════════"
echo "  📦 Step 2: Installing Frontend Dependencies"
echo "════════════════════════════════════════════════════"
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi
cd ..
echo ""

echo "════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "════════════════════════════════════════════════════"
echo ""
echo "🚀 To start the application, open 2 terminals:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then open: http://localhost:3000"
echo "Login: admin@csr.com / admin123"
echo ""
