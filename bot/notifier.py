"""
Telegram Notifier - Centralized notification system for LeetCode Bot
Handles all Telegram messaging with retry logic and formatting.
"""
import requests
from datetime import datetime
from typing import Optional
from .config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID


class TelegramNotifier:
    """Centralized Telegram notification handler."""
    
    def __init__(self, token: str = None, chat_id: str = None):
        self.token = token or TELEGRAM_BOT_TOKEN
        self.chat_id = chat_id or TELEGRAM_CHAT_ID
        self.base_url = f"https://api.telegram.org/bot{self.token}"
        self.enabled = bool(self.token and self.chat_id)
        
        if not self.enabled:
            print("⚠️ Telegram notifications disabled (missing token or chat_id)")
    
    def send(self, message: str, parse_mode: str = "HTML", silent: bool = False) -> bool:
        """
        Send a message to Telegram.
        
        Args:
            message: The message text (supports HTML formatting)
            parse_mode: "HTML" or "Markdown"
            silent: If True, sends without notification sound
        
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.enabled:
            print(f"[Telegram Disabled] {message}")
            return False
        
        try:
            response = requests.post(
                f"{self.base_url}/sendMessage",
                json={
                    "chat_id": self.chat_id,
                    "text": message,
                    "parse_mode": parse_mode,
                    "disable_web_page_preview": True,
                    "disable_notification": silent,
                },
                timeout=10
            )
            
            if response.status_code == 200:
                return True
            else:
                print(f"Telegram API error: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"Telegram send failed: {e}")
            return False
    
    # ==================== Notification Templates ====================
    
    def bot_started(self, problems_target: int, total_solved: int, total_available: int):
        """Notify that bot has started."""
        now = datetime.now().strftime("%b %d, %Y @ %I:%M %p")
        msg = f"""🚀 <b>LeetCode Bot Started</b>
━━━━━━━━━━━━━━━━━━━━
📅 {now}
🎯 Target: {problems_target} problems
📊 Progress: {total_solved}/{total_available} solved"""
        self.send(msg)
    
    def login_success(self):
        """Notify successful login."""
        self.send("✅ Logged in successfully!", silent=True)
    
    def login_failed(self, reason: str = "Unknown"):
        """Notify login failure."""
        msg = f"""❌ <b>Login Failed!</b>
━━━━━━━━━━━━━━━━━━━━
🔑 Reason: {reason}
💡 Action: Check credentials or re-authenticate manually"""
        self.send(msg)
    
    def session_expired(self):
        """Notify session/cookie expiration."""
        msg = """🔑 <b>Session Expired</b>
━━━━━━━━━━━━━━━━━━━━
🍪 LeetCode session has expired
💡 Action: Manual re-login required
🔗 Run bot with HEADLESS=false to re-authenticate"""
        self.send(msg)
    
    def problem_solved(self, number: int, name: str, runtime: str = None, memory: str = None):
        """Notify problem solved successfully."""
        msg = f"""✅ <b>Problem Solved!</b>
━━━━━━━━━━━━━━━━━━━━
📝 #{number}: {name}"""
        if runtime:
            msg += f"\n⏱️ Runtime: {runtime}"
        if memory:
            msg += f"\n💾 Memory: {memory}"
        msg += f"\n🔗 leetcode.com/problems/{name.lower().replace(' ', '-')}"
        self.send(msg)
    
    def problem_failed(self, number: int, name: str, verdict: str, details: str = None):
        """Notify problem submission failed."""
        emoji_map = {
            "wrong_answer": "❌",
            "runtime_error": "💥",
            "time_limit": "⏱️",
            "memory_limit": "📦",
            "compile_error": "🔧",
            "submission_failed": "⚠️",
        }
        emoji = emoji_map.get(verdict, "❌")
        verdict_display = verdict.replace("_", " ").title()
        
        msg = f"""{emoji} <b>{verdict_display}</b>
━━━━━━━━━━━━━━━━━━━━
📝 #{number}: {name}"""
        if details:
            msg += f"\n📋 {details}"
        self.send(msg)
    
    def premium_skipped(self, number: int, name: str):
        """Notify premium problem was skipped."""
        msg = f"""🔒 <b>Premium Problem Skipped</b>
━━━━━━━━━━━━━━━━━━━━
📝 #{number}: {name}
💳 Requires LeetCode Premium
⏭️ Moving to next problem..."""
        self.send(msg)
    
    def no_solution_found(self, number: int, name: str):
        """Notify no solution file exists."""
        msg = f"""📁 <b>No Solution Found</b>
━━━━━━━━━━━━━━━━━━━━
📝 #{number}: {name}
💾 Solution.cpp not in repository
⏭️ Skipping..."""
        self.send(msg)
    
    def cloudflare_blocked(self):
        """Notify Cloudflare challenge detected."""
        msg = """🛡️ <b>Cloudflare Block Detected</b>
━━━━━━━━━━━━━━━━━━━━
🔒 "Checking your browser" challenge triggered
⏸️ Session aborted (don't retry immediately)
💡 Wait 30+ mins or check VPS IP reputation"""
        self.send(msg)
    
    def rate_limited(self):
        """Notify rate limiting or shadow ban detected."""
        msg = """🚫 <b>Rate Limited / Shadow Ban</b>
━━━━━━━━━━━━━━━━━━━━
🔴 Submit button disabled
⏸️ Session aborted
💡 Wait 24+ hours before next run"""
        self.send(msg)
    
    def submit_stalled(self, number: int, name: str):
        """Notify submission stalled (no verdict received)."""
        msg = f"""⏳ <b>Submission Stalled</b>
━━━━━━━━━━━━━━━━━━━━
📝 #{number}: {name}
🔄 Spinner shown but no verdict after 30s
💡 Manual verification needed"""
        self.send(msg)
    
    def network_error(self, url: str, error: str):
        """Notify network/page load error."""
        msg = f"""🌐 <b>Network Error</b>
━━━━━━━━━━━━━━━━━━━━
🔗 URL: {url[:50]}...
❌ Error: {error[:100]}"""
        self.send(msg)
    
    def session_complete(self, solved: int, target: int, skipped: int, total: int, next_problem: str = None):
        """Notify daily session complete with stats."""
        msg = f"""📊 <b>Daily Session Complete</b>
━━━━━━━━━━━━━━━━━━━━
✅ Solved: {solved}/{target}"""
        if skipped > 0:
            msg += f"\n⏭️ Skipped: {skipped} (Premium/No solution)"
        msg += f"\n📈 Total Progress: {total} problems"
        if next_problem:
            msg += f"\n🎯 Next: {next_problem}"
        self.send(msg)
    
    def bot_crashed(self, error: str, traceback_str: str = None):
        """Notify bot crashed with error details."""
        msg = f"""💀 <b>Bot Crashed!</b>
━━━━━━━━━━━━━━━━━━━━
❌ Error: {error[:200]}"""
        if traceback_str:
            # Truncate traceback to avoid Telegram message limit
            tb_short = traceback_str[-500:] if len(traceback_str) > 500 else traceback_str
            msg += f"\n\n<code>{tb_short}</code>"
        self.send(msg)
    
    def custom(self, title: str, body: str, emoji: str = "📢"):
        """Send a custom notification."""
        msg = f"""{emoji} <b>{title}</b>
━━━━━━━━━━━━━━━━━━━━
{body}"""
        self.send(msg)


# Global notifier instance
notifier = TelegramNotifier()


if __name__ == "__main__":
    # Test the notifier
    print("Testing Telegram notifier...")
    n = TelegramNotifier()
    n.send("🧪 Test message from LeetCode Bot notifier!")
    print("Check your Telegram!")
