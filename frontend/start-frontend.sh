#!/bin/bash

echo "🧹 Cleaning up any running processes on ports 3000-3003..."
lsof -ti:3000,3001,3002,3003 | xargs kill -9 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 1

echo ""
echo "🔨 Building and watching remote microfrontends..."
echo "   (auth, pet, dashboard will rebuild on changes)"
echo ""

# Check if concurrently is installed
if ! command -v concurrently &> /dev/null; then
    echo "Installing concurrently..."
    npm install -g concurrently
fi

# Build skipped in dev mode
echo "🚀 Starting all apps in DEV mode..."
echo "   (ALL apps will now autoreload on changes)"
echo "🚀 Starting all apps..."
echo "   - Remotes (auth, pet, dashboard): preview mode"
echo "   - Host: dev mode with HMR"
echo ""

# Start all apps: remotes in watch mode (build+preview), host in dev
concurrently \
    "max_lines=10 cd packages/auth && npm run build -- --watch" \
    "max_lines=10 cd packages/auth && npm run preview -- --port 3001" \
    "max_lines=10 cd packages/pet && npm run build -- --watch" \
    "max_lines=10 cd packages/pet && npm run preview -- --port 3002" \
    "max_lines=10 cd packages/dashboard && npm run build -- --watch" \
    "max_lines=10 cd packages/dashboard && npm run preview -- --port 3003" \
    "sleep 5 && cd packages/host && npm run dev" \
    --names "AUTH_B,AUTH_S,PET_B,PET_S,DASH_B,DASH_S,HOST" \
    --prefix-colors "blue,blue,cyan,cyan,green,green,magenta" \
    --kill-others-on-fail
