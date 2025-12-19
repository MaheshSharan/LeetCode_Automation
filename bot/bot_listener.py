"""
Telegram Bot Listener - Handles /start, /status, /progress commands
Lightweight polling service that responds to user commands.
"""
import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from telegram import Update, ParseMode
from telegram.ext import Updater, CommandHandler, CallbackContext
from datetime import datetime

from bot.config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
from bot.progress import load_progress, get_solve_count, get_solved_set


def start(update: Update, context: CallbackContext) -> None:
    """Handle /start command."""
    msg = """✅ <b>LeetCode Automation Bot Active</b>
━━━━━━━━━━━━━━━━━━━━
🤖 This bot automatically solves LeetCode problems daily.

<b>Commands:</b>
/status - Check if bot is running
/progress - View solving progress
/next - See next problems to solve

📅 Runs daily at 5:30 AM IST
🔔 You'll receive notifications when problems are solved."""
    
    update.message.reply_text(msg, parse_mode=ParseMode.HTML)


def status(update: Update, context: CallbackContext) -> None:
    """Handle /status command."""
    now = datetime.now().strftime("%I:%M %p, %b %d")
    msg = f"""🟢 <b>Bot Status: Online</b>
━━━━━━━━━━━━━━━━━━━━
⏰ Current time: {now}
📡 Listener: Active
⏳ Next run: ~5:30 AM IST daily"""
    
    update.message.reply_text(msg, parse_mode=ParseMode.HTML)


def progress(update: Update, context: CallbackContext) -> None:
    """Handle /progress command - show solving stats."""
    try:
        data = load_progress()
        solved = data.get("solved", {})
        skipped = data.get("skipped", {})
        failed = data.get("failed", {})
        stats = data.get("stats", {})
        
        total_solved = len([s for s in solved.values() if not s.get("status", "").startswith("skipped")])
        total_skipped = len(skipped)
        total_failed = len(failed)
        last_run = stats.get("last_run", "Never")
        
        if last_run != "Never":
            # Format the date nicely
            try:
                dt = datetime.fromisoformat(last_run)
                last_run = dt.strftime("%b %d, %Y @ %I:%M %p")
            except:
                pass
        
        # Get last 5 solved problems
        recent = []
        if solved:
            sorted_problems = sorted(
                solved.items(),
                key=lambda x: x[1].get("solved_at", ""),
                reverse=True
            )[:5]
            for num, info in sorted_problems:
                status = info.get("status", "accepted")
                if status == "accepted":
                    recent.append(f"  ✅ #{num}: {info.get('name', '?')}")
                elif "skipped" in status:
                    recent.append(f"  ⏭️ #{num}: {info.get('name', '?')} (skipped)")
        
        msg = f"""📊 <b>LeetCode Bot Progress</b>
━━━━━━━━━━━━━━━━━━━━
✅ Solved: {total_solved}
⏭️ Skipped: {total_skipped} (Premium/No solution)
❌ Failed: {total_failed}

📅 Last run: {last_run}

<b>Recent Activity:</b>
{chr(10).join(recent) if recent else "  No problems solved yet"}"""
        
        update.message.reply_text(msg, parse_mode=ParseMode.HTML)
        
    except Exception as e:
        update.message.reply_text(f"❌ Error loading progress: {e}")


def next_problems(update: Update, context: CallbackContext) -> None:
    """Handle /next command - show upcoming problems."""
    try:
        from bot.solution_loader import get_available_solutions
        
        solved = get_solved_set()
        all_solutions = get_available_solutions()
        
        # Find next 5 unsolved problems
        upcoming = []
        for num, name, _ in all_solutions:
            if num not in solved:
                upcoming.append(f"  📝 #{num}: {name}")
                if len(upcoming) >= 5:
                    break
        
        remaining = len([1 for num, _, _ in all_solutions if num not in solved])
        
        msg = f"""🎯 <b>Next Problems to Solve</b>
━━━━━━━━━━━━━━━━━━━━
{chr(10).join(upcoming) if upcoming else "  🎉 All problems solved!"}

📈 Remaining: {remaining} problems"""
        
        update.message.reply_text(msg, parse_mode=ParseMode.HTML)
        
    except Exception as e:
        update.message.reply_text(f"❌ Error: {e}")


def help_command(update: Update, context: CallbackContext) -> None:
    """Handle /help command."""
    msg = """📚 <b>Available Commands</b>
━━━━━━━━━━━━━━━━━━━━
/start - Welcome message
/status - Check bot status
/progress - View solving progress
/next - See upcoming problems
/help - Show this message

🤖 The bot runs automatically at 5:30 AM IST daily."""
    
    update.message.reply_text(msg, parse_mode=ParseMode.HTML)


def main() -> None:
    """Start the bot listener."""
    if not TELEGRAM_BOT_TOKEN:
        print("❌ TELEGRAM_BOT_TOKEN not set in environment!")
        print("   Add it to bot/.env file")
        return
    
    print("🤖 Starting Telegram bot listener...")
    print(f"   Token: {TELEGRAM_BOT_TOKEN[:20]}...")
    
    # Create the Updater
    updater = Updater(TELEGRAM_BOT_TOKEN, use_context=True)
    
    # Get the dispatcher to register handlers
    dp = updater.dispatcher
    
    # Register command handlers
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("status", status))
    dp.add_handler(CommandHandler("progress", progress))
    dp.add_handler(CommandHandler("next", next_problems))
    dp.add_handler(CommandHandler("help", help_command))
    
    # Start polling
    print("✅ Bot listener started! Waiting for commands...")
    updater.start_polling()
    
    # Run until Ctrl+C
    updater.idle()


if __name__ == "__main__":
    main()
