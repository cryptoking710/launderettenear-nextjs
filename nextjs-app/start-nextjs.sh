#!/bin/bash
set -e

echo "=== Next.js Development Server ==="
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies (this may take 2-3 minutes)..."
  npm install --legacy-peer-deps --silent
  echo "✅ Dependencies installed"
fi

echo "🚀 Starting Next.js on http://localhost:3000"
npm run dev
