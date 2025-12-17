#!/bin/bash
echo "Starting Pet Management System..."

# Install concurrently if not present
if ! command -v concurrently &> /dev/null; then
    echo "Installing concurrently..."
    npm install -g concurrently
fi

concurrently \
    "cd backend/gateway && npm run dev" \
    "cd backend/services/auth && npm run dev" \
    "cd backend/services/pet && npm run dev" \
    "cd backend/services/application && npm run dev" \
    "cd frontend/packages/host && npm run dev" \
    "cd frontend/packages/auth && npm run dev" \
    "cd frontend/packages/pet && npm run dev" \
    "cd frontend/packages/dashboard && npm run dev" \
    --names "GATEWAY,AUTH,PET,APP,HOST,AUTH-FE,PET-FE,DASH-FE" \
    --prefix-colors "gray,blue,cyan,green,magenta,blue,cyan,green"
