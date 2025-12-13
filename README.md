# LeetCode Daily Bot

Automated LeetCode problem solver using Google OAuth login and C++ solutions.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt
playwright install chromium

# Setup credentials
cp .env.example bot/.env
nano bot/.env  # Add your Gmail credentials

# Run the bot
python -m bot.main
```

## VPS Deployment

### 1. Copy to Server
```bash
scp -r . root@your-vps:/var/www/leetcode-bot/
```

### 2. Run Setup Script
```bash
ssh root@your-vps
cd /var/www/leetcode-bot
chmod +x deploy.sh
./deploy.sh
```

### 3. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Check Status
```bash
pm2 status
pm2 logs leetcode-bot
```

## Configuration

Edit `bot/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `LEETCODE_USERNAME` | Gmail email | Required |
| `LEETCODE_PASSWORD` | Gmail password | Required |
| `HEADLESS` | Run invisible | `true` |
| `PROBLEMS_PER_RUN` | Problems per run | `2` |

## Project Structure

```
├── bot/
│   ├── main.py           # Main automation
│   ├── browser_automation.py
│   ├── solution_loader.py
│   ├── progress.py       # Tracks solved problems
│   └── browser_profile/  # Saved login session
├── solutions/            # 3000+ C++ solutions
├── ecosystem.config.js   # PM2 cron config
├── deploy.sh            # VPS setup script
└── requirements.txt
```

## How It Works

1. **Login**: Google OAuth (bypasses Cloudflare)
2. **Select Problem**: Next unsolved problem sequentially
3. **Load Solution**: From `/solutions` folder
4. **Submit**: Insert code and submit to LeetCode
5. **Track**: Save to `progress.json` (won't re-solve)

## License

MIT
