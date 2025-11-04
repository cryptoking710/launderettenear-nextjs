#!/bin/bash

# LaunderetteNear.me - Next.js Quick Setup Script
# This script automates the installation and configuration process

set -e  # Exit on any error

echo "🚀 LaunderetteNear.me - Next.js Setup"
echo "===================================="
echo ""

# Check if we're in the nextjs-app directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the nextjs-app directory"
    echo "   Run: cd nextjs-app && bash setup.sh"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
echo "   This may take 1-2 minutes..."
echo ""

if npm install; then
    echo "✅ Dependencies installed successfully"
    echo ""
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Step 2: Set up environment variables
echo "🔧 Step 2: Setting up environment variables..."
echo ""

if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists"
    read -p "   Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.local.example .env.local
        echo "✅ .env.local recreated from example"
    else
        echo "ℹ️  Keeping existing .env.local"
    fi
else
    cp .env.local.example .env.local
    echo "✅ .env.local created from example"
fi

echo ""
echo "⚠️  IMPORTANT: You need to edit .env.local with your Firebase credentials"
echo ""
echo "📝 To get your Firebase credentials:"
echo "   1. Go to: https://console.firebase.google.com"
echo "   2. Select your project"
echo "   3. Click gear icon → Project Settings"
echo ""
echo "   For Admin SDK (server-side):"
echo "   - Go to 'Service Accounts' tab"
echo "   - Click 'Generate New Private Key'"
echo "   - Download the JSON file"
echo "   - Copy project_id, client_email, and private_key to .env.local"
echo ""
echo "   For Client SDK (client-side):"
echo "   - Scroll to 'Your apps' section"
echo "   - Click your web app"
echo "   - Copy apiKey, authDomain, projectId, and appId to .env.local"
echo ""

read -p "Press Enter to open .env.local in nano editor (or Ctrl+C to skip)..."
nano .env.local 2>/dev/null || vi .env.local 2>/dev/null || echo "Please edit .env.local manually"

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Next steps:"
echo "   1. Make sure .env.local has your Firebase credentials"
echo "   2. Run: npm run dev"
echo "   3. Visit: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Setup guide: SETUP.md"
echo "   - Project info: README.md"
echo "   - Migration plan: ../docs/nextjs-migration-plan.md"
echo ""
