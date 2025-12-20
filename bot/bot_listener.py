"""
Telegram Bot Listener - Handles /start, /status, /progress commands
Simple polling using requests - no external telegram library needed.
"""
import os
import sys
import time
import requests
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from bot.config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
from bot.progress import load_progress, get_solve_count, get_solved_set


class SimpleTelegramBot:
    """Simple Telegram bot using requests only."""
    
    def __init__(self, token: str):
        self.token = token
        self.base_url = f"https://api.telegram.org/bot{token}"
        self.offset = 0
    
    def send_message(self, chat_id: int, text: str, parse_mode: str = "HTML") -> bool:
        """Send a message."""
        try:
            response = requests.post(
                f"{self.base_url}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": text,
                    "parse_mode": parse_mode,
                    "disable_web_page_preview": True,
                },
                timeout=10
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Error sending message: {e}")
            return False
    
    def get_updates(self, timeout: int = 30) -> list:
        """Get updates using long polling."""
        try:
            response = requests.get(
                f"{self.base_url}/getUpdates",
                params={
                    "offset": self.offset,
                    "timeout": timeout,
                    "allowed_updates": ["message"],
                },
                timeout=timeout + 5
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("ok"):
                    return data.get("result", [])
            return []
        except requests.exceptions.Timeout:
            return []
        except Exception as e:
            print(f"Error getting updates: {e}")
            return []
    
    def handle_command(self, message: dict) -> None:
        """Handle incoming command."""
        chat_id = message["chat"]["id"]
        text = message.get("text", "")
        
        if not text.startswith("/"):
            return
        
        command = text.split()[0].lower().replace("@", " ").split()[0]
        
        if command == "/start":
            self.cmd_start(chat_id)
        elif command == "/status":
            self.cmd_status(chat_id)
        elif command == "/progress":
            self.cmd_progress(chat_id)
        elif command == "/next":
            self.cmd_next(chat_id)
        elif command == "/help":
            self.cmd_help(chat_id)
    
    def cmd_start(self, chat_id: int) -> None:
        """Handle /start command."""
        msg = """<b>LeetCode Automation Bot Active</b>

This bot automatically solves LeetCode problems daily.

<b>Commands:</b>
/status - Check if bot is running
/progress - View solving progress
/next - See next problems to solve

Runs daily at 5:30 AM IST
You'll receive notifications when problems are solved."""
        self.send_message(chat_id, msg)
    
    def cmd_status(self, chat_id: int) -> None:
        """Handle /status command."""
        now = datetime.now().strftime("%I:%M %p, %b %d")
        msg = f"""<b>Bot Status: Online</b>

Current time: {now}
Listener: Active
Next run: ~5:30 AM IST daily"""
        self.send_message(chat_id, msg)
    
    def cmd_progress(self, chat_id: int) -> None:
        """Handle /progress command."""
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
                try:
                    dt = datetime.fromisoformat(last_run)
                    last_run = dt.strftime("%b %d, %Y @ %I:%M %p")
                except:
                    pass
            
            recent = []
            if solved:
                sorted_problems = sorted(
                    solved.items(),
                    key=lambda x: x[1].get("solved_at", ""),
                    reverse=True
                )[:5]
                for num, info in sorted_problems:
                    status_str = info.get("status", "accepted")
                    if status_str == "accepted":
                        recent.append(f"  #{num}: {info.get('name', '?')}")
                    elif "skipped" in status_str:
                        recent.append(f"  #{num}: {info.get('name', '?')} (skipped)")
            
            msg = f"""<b>LeetCode Bot Progress</b>

Solved: {total_solved}
Skipped: {total_skipped} (Premium/No solution)
Failed: {total_failed}

Last run: {last_run}

<b>Recent Activity:</b>
{chr(10).join(recent) if recent else "  No problems solved yet"}"""
            self.send_message(chat_id, msg)
        except Exception as e:
            self.send_message(chat_id, f"Error loading progress: {e}")
    
    def cmd_next(self, chat_id: int) -> None:
        """Handle /next command."""
        try:
            from bot.solution_loader import get_available_solutions
            
            solved = get_solved_set()
            all_solutions = get_available_solutions()
            
            upcoming = []
            for num, name, _ in all_solutions:
                if num not in solved:
                    upcoming.append(f"  #{num}: {name}")
                    if len(upcoming) >= 5:
                        break
            
            remaining = len([1 for num, _, _ in all_solutions if num not in solved])
            
            msg = f"""<b>Next Problems to Solve</b>

{chr(10).join(upcoming) if upcoming else "  All problems solved!"}

Remaining: {remaining} problems"""
            self.send_message(chat_id, msg)
        except Exception as e:
            self.send_message(chat_id, f"Error: {e}")
    
    def cmd_help(self, chat_id: int) -> None:
        """Handle /help command."""
        msg = """<b>Available Commands</b>

/start - Welcome message
/status - Check bot status
/progress - View solving progress
/next - See upcoming problems
/help - Show this message

The bot runs automatically at 5:30 AM IST daily."""
        self.send_message(chat_id, msg)
    
    def run(self) -> None:
        """Run the bot polling loop."""
        print("Bot listener started! Waiting for commands...")
        
        while True:
            try:
                updates = self.get_updates(timeout=30)
                
                for update in updates:
                    self.offset = update["update_id"] + 1
                    
                    if "message" in update:
                        self.handle_command(update["message"])
                        
            except KeyboardInterrupt:
                print("Bot stopped.")
                break
            except Exception as e:
                print(f"Error in polling loop: {e}")
                time.sleep(5)


def main() -> None:
    """Start the bot listener."""
    if not TELEGRAM_BOT_TOKEN:
        print("TELEGRAM_BOT_TOKEN not set!")
        return
    
    print("Starting Telegram bot listener...")
    print(f"   Token: {TELEGRAM_BOT_TOKEN[:20]}...")
    
    bot = SimpleTelegramBot(TELEGRAM_BOT_TOKEN)
    bot.run()


if __name__ == "__main__":
    main()
