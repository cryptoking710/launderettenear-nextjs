#!/bin/bash

# Next.js Installation and Startup Script
# This script installs dependencies and starts the Next.js dev server

set -e

echo "=== Next.js App Setup ==="
echo ""

# Navigate to nextjs-app directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  echo "This may take a few minutes..."
  echo ""
  npm install --legacy-peer-deps
  echo ""
  echo "✅ Dependencies installed successfully"
  echo ""
else
  echo "✅ Dependencies already installed"
  echo ""
fi

# Start the development server
echo "🚀 Starting Next.js development server..."
echo "   Server will be available at http://localhost:3000"
echo ""
npm run dev
