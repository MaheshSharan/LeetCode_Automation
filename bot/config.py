"""
Configuration module for LeetCode Daily Bot
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from bot/.env or project root .env
BOT_DIR = Path(__file__).parent
PROJECT_ROOT = BOT_DIR.parent

# Try to load from bot folder first, then project root
if (BOT_DIR / ".env").exists():
    load_dotenv(BOT_DIR / ".env")
else:
    load_dotenv(PROJECT_ROOT / ".env")

# Paths
SOLUTIONS_DIR = PROJECT_ROOT / "solutions"
PROGRESS_FILE = PROJECT_ROOT / "bot" / "progress.json"

# LeetCode URLs
LEETCODE_BASE_URL = "https://leetcode.com"
LEETCODE_LOGIN_URL = f"{LEETCODE_BASE_URL}/accounts/login/"
LEETCODE_PROBLEMS_URL = f"{LEETCODE_BASE_URL}/problems"
LEETCODE_GRAPHQL_URL = f"{LEETCODE_BASE_URL}/graphql"

# Credentials
LEETCODE_USERNAME = os.getenv("LEETCODE_USERNAME", "")
LEETCODE_PASSWORD = os.getenv("LEETCODE_PASSWORD", "")

# Session cookies (fallback)
LEETCODE_SESSION = os.getenv("LEETCODE_SESSION", "")
CSRF_TOKEN = os.getenv("CSRF_TOKEN", "")

# Bot settings
PROBLEMS_PER_RUN = int(os.getenv("PROBLEMS_PER_RUN", "1"))
HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"

# Problem ranges (matching solutions folder structure)
PROBLEM_RANGES = [
    "0000-0099", "0100-0199", "0200-0299", "0300-0399", "0400-0499",
    "0500-0599", "0600-0699", "0700-0799", "0800-0899", "0900-0999",
    "1000-1099", "1100-1199", "1200-1299", "1300-1399", "1400-1499",
    "1500-1599", "1600-1699", "1700-1799", "1800-1899", "1900-1999",
    "2000-2099", "2100-2199", "2200-2299", "2300-2399", "2400-2499",
    "2500-2599", "2600-2699", "2700-2799", "2800-2899", "2900-2999",
    "3000-3099", "3100-3199", "3200-3299", "3300-3399",
]


def get_problem_range(problem_number: int) -> str:
    """Get the folder range for a problem number (e.g., 1 -> '0000-0099')"""
    range_start = (problem_number // 100) * 100
    range_end = range_start + 99
    return f"{range_start:04d}-{range_end:04d}"
