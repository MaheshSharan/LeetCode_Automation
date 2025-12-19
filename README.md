# LeetCode Daily Bot 🤖

Automated LeetCode problem solver using Google OAuth login and C++ solutions. Runs daily via cron, with Telegram notifications for all events.

## Features

- ✅ **Auto-solves** LeetCode problems daily (via PM2 cron)
- 📱 **Telegram notifications** for solved/failed/skipped problems
- 🔒 **Premium detection** - automatically skips locked problems
- 🛡️ **Edge case handling** - Cloudflare, rate limits, stalled submissions
- 💾 **Progress tracking** - never re-solves the same problem

## Quick Start (Local)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
playwright install chromium

# Setup credentials
cp .env.example bot/.env
nano bot/.env  # Add your credentials

# Run the bot
python -m bot.main
```

## VPS Deployment

### 1. Clone to Server
```bash
cd /var/www/
git clone https://github.com/MaheshSharan/LeetCode_Automation leetcode-bot
cd /var/www/leetcode-bot
```

### 2. Run Setup Script
```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. Configure Environment
```bash
nano bot/.env
```

Add your credentials:
```env
LEETCODE_USERNAME=your_gmail@gmail.com
LEETCODE_PASSWORD=your_gmail_password
HEADLESS=true
PROBLEMS_PER_RUN=2

# Telegram (optional but recommended)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 4. Test the Bot (Optional)
```bash
source venv/bin/activate
python -m bot.main
```

### 5. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Check Status
```bash
pm2 status
pm2 logs leetcode-solver --lines 50
pm2 logs leetcode-listener --lines 20
```

## Telegram Bot Commands

If you set up the Telegram listener, these commands work:

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/status` | Check if bot is online |
| `/progress` | View solving stats |
| `/next` | See upcoming problems |
| `/help` | List all commands |

## Configuration

Edit `bot/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `LEETCODE_USERNAME` | Gmail email | Required |
| `LEETCODE_PASSWORD` | Gmail password | Required |
| `HEADLESS` | Run without browser window | `true` |
| `PROBLEMS_PER_RUN` | Problems to solve per run | `2` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | Optional |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | Optional |

## Project Structure

```
├── bot/
│   ├── main.py              # Main automation orchestrator
│   ├── notifier.py          # Telegram notifications
│   ├── bot_listener.py      # Telegram command handler
│   ├── solution_loader.py   # Loads C++ solutions
│   ├── progress.py          # Tracks solved problems
│   ├── config.py            # Configuration
│   ├── progress.json        # Solved problems data
│   └── browser_profile/     # Saved login session
├── solutions/               # 3000+ C++ solutions
├── ecosystem.config.js      # PM2 config (solver + listener)
├── deploy.sh                # VPS setup script
└── requirements.txt
```

## How It Works

1. **Login**: Google OAuth (bypasses Cloudflare)
2. **Load Progress**: Check `progress.json` for solved problems
3. **Select Problem**: Next unsolved problem sequentially
4. **Premium Check**: Skip if locked (notifies via Telegram)
5. **Load Solution**: From `/solutions` folder
6. **Submit**: Insert code via Monaco editor API
7. **Wait for Verdict**: Timeout after 30s if stalled
8. **Track**: Save result to `progress.json`
9. **Notify**: Send Telegram message with result

## PM2 Apps

| App | Purpose | Schedule |
|-----|---------|----------|
| `leetcode-solver` | Solves problems | Cron: 5:30 AM IST daily |
| `leetcode-listener` | Telegram commands | 24/7 (lightweight ~20MB) |

## Troubleshooting

```bash
# View solver logs
pm2 logs leetcode-solver --lines 100

# View listener logs
pm2 logs leetcode-listener --lines 50

# Restart everything
pm2 restart all

# Check progress file
cat bot/progress.json

# Force a manual run
source venv/bin/activate
python -m bot.main
```

## License

MIT
