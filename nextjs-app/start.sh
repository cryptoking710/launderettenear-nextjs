#!/bin/bash

# LaunderetteNear.me - Next.js Quick Start Script
# This script checks requirements and starts the dev server

set -e

echo "🚀 Starting Next.js Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed"
    echo "   Run: bash setup.sh"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found"
    echo "   Run: bash setup.sh"
    exit 1
fi

# Check if .env.local has Firebase credentials
if grep -q "your-project-id" .env.local || grep -q "your-api-key" .env.local; then
    echo "⚠️  Warning: .env.local appears to have placeholder values"
    echo "   Please edit .env.local with your real Firebase credentials"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ All checks passed"
echo ""
echo "🌐 Starting server on http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

npm run dev
