#!/bin/bash
set -e  # Exit on error

echo "=== Manual Build Process ==="

# Clean previous test
rm -rf manual-dist

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Create a fresh clone in temp directory
echo "📋 Creating fresh clone..."
TEMP_DIR=$(mktemp -d)
git clone . "$TEMP_DIR"
cd "$TEMP_DIR"

# Checkout the same branch
git checkout "$CURRENT_BRANCH"

# Setup (simulate CI environment)
export HUSKY=0
export CI=true

echo "📦 Installing Node dependencies..."
npm ci --ignore-scripts

echo "🎼 Installing Composer dependencies (production only)..."
composer install --no-dev --optimize-autoloader --prefer-dist

echo "🏗️  Building assets..."
npm run build

echo "📋 Creating distribution directory..."
mkdir -p manual-dist/wp-devbench
rsync -av --exclude-from=".distignore" ./ manual-dist/wp-devbench/

echo "🗜️  Creating zip file..."
cd manual-dist
zip -r wp-devbench.zip wp-devbench
ZIP_PATH=$(pwd)/wp-devbench.zip

# Move the zip back to original directory
cd "$OLDPWD"
mv "$ZIP_PATH" ./manual-dist/wp-devbench.zip

# Clean up temp directory
echo "🧹 Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "✅ Build complete!"
echo "📦 Distribution created at: manual-dist/wp-devbench.zip"
echo ""
echo "To test the plugin:"
echo "1. Unzip manual-dist/wp-devbench.zip"
echo "2. Copy to your WordPress plugins directory"
echo "3. Activate and test"

# Show what's included
echo ""
echo "📂 Files included in distribution:"
unzip -l manual-dist/wp-devbench.zip | head -n 50

