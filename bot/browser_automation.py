"""
LeetCode Login via Google OAuth
Bypasses Cloudflare by using Google Sign-In
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright, BrowserContext, Page
from .config import (
    LEETCODE_LOGIN_URL,
    LEETCODE_USERNAME,  # Gmail email
    LEETCODE_PASSWORD,  # Gmail password
    HEADLESS,
    PROJECT_ROOT,
)

BROWSER_PROFILE_DIR = PROJECT_ROOT / "bot" / "browser_profile"


async def create_context(playwright) -> BrowserContext:
    """Create persistent browser context."""
    BROWSER_PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    
    context = await playwright.chromium.launch_persistent_context(
        user_data_dir=str(BROWSER_PROFILE_DIR),
        headless=HEADLESS,
        viewport={"width": 1920, "height": 1080},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
        ]
    )
    return context


async def check_logged_in(page: Page) -> bool:
    """Check if already logged in."""
    await page.goto("https://leetcode.com/profile/account/")
    await asyncio.sleep(3)
    
    if "login" in page.url.lower() or "accounts" in page.url.lower():
        return False
    return True


async def login_with_google(page: Page, gmail_email: str, gmail_password: str) -> bool:
    """Login to LeetCode using Google OAuth."""
    
    # Step 1: Go to LeetCode login page
    print("Step 1: Going to LeetCode login page...")
    await page.goto(LEETCODE_LOGIN_URL)
    await asyncio.sleep(5)
    
    # Step 2: Click "Login with Google"
    print("Step 2: Clicking 'Login with Google'...")
    try:
        google_btn = page.locator('a[href*="/accounts/google/login"]')
        await google_btn.wait_for(timeout=10000)
        await google_btn.click()
        await asyncio.sleep(5)
    except Exception as e:
        print(f"Error clicking Google button: {e}")
        return False
    
    print(f"  Current URL: {page.url}")
    
    # Step 3: Enter Gmail email
    print(f"Step 3: Entering Gmail email: {gmail_email}")
    try:
        # Wait for email input - Google uses input[type="email"]
        email_input = page.locator('input[type="email"]')
        await email_input.wait_for(timeout=10000)
        await email_input.fill(gmail_email)
        await asyncio.sleep(1)
        
        # Click Next button - multiple selectors
        print("  Clicking Next...")
        await page.keyboard.press("Enter")
        await asyncio.sleep(5)
    except Exception as e:
        print(f"Error on email step: {e}")
        return False
    
    print(f"  Current URL: {page.url}")
    
    # Step 4: Enter Gmail password
    print("Step 4: Entering Gmail password...")
    try:
        # Wait for password input
        password_input = page.locator('input[type="password"]')
        await password_input.wait_for(timeout=10000)
        await password_input.fill(gmail_password)
        await asyncio.sleep(1)
        
        # Click Next
        print("  Clicking Next...")
        await page.keyboard.press("Enter")
        await asyncio.sleep(8)
    except Exception as e:
        print(f"Error on password step: {e}")
        return False
    
    print(f"  Current URL: {page.url}")
    
    # Step 5: Check if we're back on LeetCode
    print("Step 5: Checking login result...")
    await asyncio.sleep(3)
    
    current_url = page.url
    if "leetcode.com" in current_url and "login" not in current_url.lower():
        print("✓ Successfully logged in via Google!")
        return True
    
    print(f"  Still not on LeetCode. URL: {current_url}")
    return False


async def main():
    """Main function."""
    print("\n" + "=" * 50)
    print("LeetCode Login via Google OAuth")
    print("=" * 50)
    print(f"\nGmail: {LEETCODE_USERNAME}")
    print(f"Headless: {HEADLESS}")
    print()
    
    if not LEETCODE_USERNAME or not LEETCODE_PASSWORD:
        print("ERROR: Set LEETCODE_USERNAME and LEETCODE_PASSWORD in .env")
        return False
    
    async with async_playwright() as p:
        context = await create_context(p)
        page = await context.new_page()
        
        # Check if already logged in
        print("Checking if already logged in...")
        if await check_logged_in(page):
            print("✓ Already logged in from previous session!")
            await asyncio.sleep(3)
            await context.close()
            return True
        
        # Login with Google
        print("\nNot logged in. Starting Google OAuth flow...\n")
        success = await login_with_google(page, LEETCODE_USERNAME, LEETCODE_PASSWORD)
        
        if success:
            print("\n" + "=" * 50)
            print("✓ LOGIN SUCCESSFUL!")
            print("  Session saved to browser profile.")
            print("=" * 50)
            await asyncio.sleep(5)
        else:
            print("\n" + "=" * 50)
            print("✗ LOGIN FAILED")
            print("  Browser staying open for debugging...")
            print("  Press Ctrl+C when done.")
            print("=" * 50)
            try:
                while True:
                    await asyncio.sleep(10)
                    print(f"URL: {page.url}")
            except KeyboardInterrupt:
                pass
        
        await context.close()
        return success


if __name__ == "__main__":
    result = asyncio.run(main())
    print(f"\nResult: {'SUCCESS' if result else 'FAILED'}")
