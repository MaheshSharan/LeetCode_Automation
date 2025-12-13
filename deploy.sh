#!/bin/bash
# LeetCode Bot - VPS Deployment Script
# Works in any directory where the repo is cloned

set -e

echo "=========================================="
echo "LeetCode Bot - VPS Setup"
echo "=========================================="

# Use current directory
BOT_DIR="$(pwd)"
LOG_DIR="$BOT_DIR/logs"
VENV_DIR="$BOT_DIR/venv"

# Create directories
echo "[1/6] Creating directories..."
mkdir -p $LOG_DIR

# Install system dependencies (requires sudo)
echo "[2/6] Installing system dependencies..."
if command -v apt &> /dev/null; then
    sudo apt update
    sudo apt install -y python3 python3-pip python3-venv python3-full
    
    # Install Playwright browser dependencies
    echo "[3/6] Installing browser dependencies..."
    sudo apt install -y libnss3 libnspr4 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
        libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64 2>/dev/null || \
    sudo apt install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
        libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
else
    echo "  Skipping apt (not available). Install Python 3 manually."
fi

# Create virtual environment
echo "[4/6] Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python packages
echo "[5/6] Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt
playwright install chromium

# Create .env file template
echo "[6/6] Setting up environment..."
if [ ! -f "bot/.env" ]; then
    cat > bot/.env << 'EOF'
LEETCODE_USERNAME=your_gmail@gmail.com
LEETCODE_PASSWORD=your_gmail_password
HEADLESS=true
PROBLEMS_PER_RUN=2
EOF
    echo "  ⚠️  Edit bot/.env with your credentials!"
else
    echo "  ✓ bot/.env already exists"
fi

# Update ecosystem.config.js with current path
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: "leetcode-bot",
    script: "$VENV_DIR/bin/python",
    args: "-m bot.main",
    cwd: "$BOT_DIR",
    cron_restart: "0 0 * * *",
    autorestart: false,
    error_file: "$LOG_DIR/error.log",
    out_file: "$LOG_DIR/output.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    env: { HEADLESS: "true", PROBLEMS_PER_RUN: "2" }
  }]
};
EOF

echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "To run:"
echo "  source venv/bin/activate"
echo "  python -m bot.main"
echo ""
echo "Or with PM2:"
echo "  pm2 start ecosystem.config.js"
echo ""
