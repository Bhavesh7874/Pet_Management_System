#!/bin/bash

echo "🧹 Cleaning up any running backend processes..."
lsof -ti:4000,5001,5002,5003 | xargs kill -9 2>/dev/null || true
pkill -f "node.*backend" 2>/dev/null || true
sleep 1

echo ""
echo "🚀 Starting all backend services..."
echo ""

# Check if concurrently is installed
if ! command -v concurrently &> /dev/null; then
    echo "Installing concurrently..."
    npm install -g concurrently
fi

# Start all backend services
concurrently \
    "cd gateway && npm run dev" \
    "cd services/auth && npm run dev" \
    "cd services/pet && npm run dev" \
    "cd services/application && npm run dev" \
    --names "GATEWAY:4000,AUTH:5001,PET:5002,APP:5003" \
    --prefix-colors "magenta,blue,cyan,green" \
    --kill-others-on-fail
