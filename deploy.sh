#!/bin/bash
# LeetCode Bot - VPS Deployment Script
# Tested on Ubuntu 24.04

set -e

echo "=========================================="
echo "LeetCode Bot - VPS Setup"
echo "=========================================="

# Variables
BOT_DIR="/var/www/leetcode-bot"
LOG_DIR="/var/log/leetcode-bot"
VENV_DIR="$BOT_DIR/venv"

# Create directories
echo "[1/7] Creating directories..."
mkdir -p $BOT_DIR
mkdir -p $LOG_DIR

# Install system dependencies
echo "[2/7] Installing system dependencies..."
apt update
apt install -y python3 python3-pip python3-venv python3-full

# Install Playwright browser dependencies (Ubuntu 24.04 package names)
echo "[3/7] Installing browser dependencies..."
apt install -y libnss3 libnspr4 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64 2>/dev/null || \
apt install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# Create virtual environment
echo "[4/7] Creating Python virtual environment..."
cd $BOT_DIR
python3 -m venv venv
source venv/bin/activate

# Install Python packages
echo "[5/7] Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Playwright browser
echo "[6/7] Installing Playwright Chromium..."
playwright install chromium

# Create .env file template
echo "[7/7] Setting up environment..."
if [ ! -f "bot/.env" ]; then
    cat > bot/.env << 'EOF'
LEETCODE_USERNAME=your_gmail@gmail.com
LEETCODE_PASSWORD=your_gmail_password
HEADLESS=true
PROBLEMS_PER_RUN=2
EOF
    echo "  ⚠️  Edit bot/.env with your actual credentials!"
else
    echo "  ✓ bot/.env already exists"
fi

echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "IMPORTANT: Always activate venv before running!"
echo ""
echo "source /var/www/leetcode-bot/venv/bin/activate"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit credentials:"
echo "   nano $BOT_DIR/bot/.env"
echo ""
echo "2. Test run:"
echo "   source venv/bin/activate"
echo "   python -m bot.main"
echo ""
echo "3. Start PM2 cron:"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save && pm2 startup"
echo ""
