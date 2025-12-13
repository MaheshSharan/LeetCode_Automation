#!/bin/bash
# LeetCode Bot - VPS Deployment Script
# Tested on Ubuntu 22.04

set -e

echo "=========================================="
echo "LeetCode Bot - VPS Setup"
echo "=========================================="

# Variables
BOT_DIR="/var/www/leetcode-bot"
LOG_DIR="/var/log/leetcode-bot"

# Create directories
echo "[1/6] Creating directories..."
mkdir -p $BOT_DIR
mkdir -p $LOG_DIR

# Install system dependencies
echo "[2/6] Installing system dependencies..."
apt update
apt install -y python3 python3-pip python3-venv

# Install Playwright dependencies
echo "[3/6] Installing Playwright browser dependencies..."
apt install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# Copy project files (assuming you've already cloned/copied)
echo "[4/6] Setting up Python environment..."
cd $BOT_DIR
pip3 install -r requirements.txt
playwright install chromium

# Create .env file template
echo "[5/6] Creating environment file..."
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

# Setup PM2
echo "[6/6] Setting up PM2..."
npm install -g pm2 2>/dev/null || echo "PM2 already installed"

echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit credentials:"
echo "   nano $BOT_DIR/bot/.env"
echo ""
echo "2. First run (with visible browser for Google login):"
echo "   cd $BOT_DIR && HEADLESS=false python3 -m bot.main"
echo ""
echo "3. After login works, start with PM2:"
echo "   cd $BOT_DIR && pm2 start ecosystem.config.js"
echo ""
echo "4. Save PM2 config:"
echo "   pm2 save && pm2 startup"
echo ""
echo "5. Check logs:"
echo "   pm2 logs leetcode-bot"
echo "   tail -f $LOG_DIR/output.log"
echo ""
