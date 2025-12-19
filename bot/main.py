"""
LeetCode Daily Bot - Main Automation Script
Solves LeetCode problems sequentially using pre-existing C++ solutions.
With Telegram notifications and comprehensive edge case handling.
"""
import asyncio
import traceback
from pathlib import Path
from playwright.async_api import async_playwright, Page, BrowserContext, TimeoutError as PlaywrightTimeout

from .config import (
    LEETCODE_LOGIN_URL,
    LEETCODE_USERNAME,
    LEETCODE_PASSWORD,
    HEADLESS,
    PROJECT_ROOT,
    PROBLEMS_PER_RUN,
)
from .solution_loader import load_solution, get_available_solutions
from .progress import (
    get_solved_set, 
    mark_as_solved, 
    mark_as_failed, 
    mark_as_skipped,
    get_solve_count, 
    get_progress_summary
)
from .notifier import notifier

BROWSER_PROFILE_DIR = PROJECT_ROOT / "bot" / "browser_profile"


# ==================== Edge Case Detection ====================

async def detect_cloudflare(page: Page) -> bool:
    """Detect Cloudflare challenge page."""
    try:
        # Check for common Cloudflare challenge indicators
        cf_indicators = [
            page.locator("text=Checking your browser"),
            page.locator("text=Just a moment"),
            page.locator("#challenge-running"),
            page.locator(".cf-browser-verification"),
        ]
        for indicator in cf_indicators:
            if await indicator.count() > 0:
                return True
        return False
    except Exception:
        return False


async def detect_premium_problem(page: Page) -> bool:
    """
    Detect if current problem requires premium subscription.
    Uses 3-tier detection hierarchy (fastest to slowest).
    """
    try:
        # Tier 1: URL-based detection (fastest)
        current_url = page.url.lower()
        if "subscribe" in current_url or "/premium" in current_url:
            return True
        
        # Tier 2: Text-based detection (most stable)
        await page.wait_for_load_state("domcontentloaded")
        premium_texts = [
            page.locator("text=Subscribe to unlock"),
            page.locator("text=Premium Question"),
            page.locator("text=This question is for premium users only"),
        ]
        for locator in premium_texts:
            if await locator.count() > 0:
                return True
        
        # Tier 3: Editor absence check (fallback - less reliable)
        # Wait a reasonable time for editor to load
        await asyncio.sleep(3)
        editor = page.locator(".monaco-editor")
        if await editor.count() == 0:
            # Double-check by looking for premium lock icon
            lock_icon = page.locator('[data-icon="lock"]')
            if await lock_icon.count() > 0:
                return True
        
        return False
    except Exception as e:
        print(f"Error detecting premium: {e}")
        return False


async def detect_rate_limit(page: Page) -> bool:
    """Detect if we're rate limited or shadow banned."""
    try:
        submit_btn = page.locator('[data-e2e-locator="console-submit-button"]')
        if await submit_btn.count() > 0:
            is_disabled = await submit_btn.is_disabled()
            if is_disabled:
                return True
        return False
    except Exception:
        return False


async def wait_for_verdict(page: Page, timeout_ms: int = 30000) -> str:
    """
    Wait for submission verdict with timeout.
    Returns: "accepted", "wrong_answer", "runtime_error", "time_limit", 
             "memory_limit", "compile_error", "stalled", or "unknown"
    """
    try:
        # Wait for submission result to appear
        # LeetCode shows result in a specific area after submission
        start_time = asyncio.get_event_loop().time()
        timeout_sec = timeout_ms / 1000
        
        while (asyncio.get_event_loop().time() - start_time) < timeout_sec:
            # Check for various verdict indicators
            page_content = await page.content()
            
            if "Accepted" in page_content:
                # Verify it's the actual verdict, not just text on page
                accepted = page.locator('[data-e2e-locator="submission-result"]')
                if await accepted.count() > 0:
                    return "accepted"
                # Alternative check
                if await page.locator('text="Accepted"').count() > 0:
                    return "accepted"
            
            if "Wrong Answer" in page_content:
                return "wrong_answer"
            if "Runtime Error" in page_content:
                return "runtime_error"
            if "Time Limit Exceeded" in page_content:
                return "time_limit"
            if "Memory Limit Exceeded" in page_content:
                return "memory_limit"
            if "Compile Error" in page_content:
                return "compile_error"
            
            await asyncio.sleep(1)
        
        return "stalled"
            
    except Exception as e:
        print(f"Error waiting for verdict: {e}")
        return "unknown"


# ==================== Core Functions ====================

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
    try:
        await page.goto("https://leetcode.com/profile/account/", timeout=30000)
        await asyncio.sleep(3)
        
        # Check for Cloudflare first
        if await detect_cloudflare(page):
            notifier.cloudflare_blocked()
            return False
        
        return "login" not in page.url.lower() and "accounts" not in page.url.lower()
    except PlaywrightTimeout:
        notifier.network_error("leetcode.com/profile", "Page load timeout")
        return False


async def login_with_google(page: Page, email: str, password: str) -> bool:
    """Login to LeetCode using Google OAuth. Handles auto-login from saved profile."""
    print("Logging in via Google OAuth...")
    
    try:
        await page.goto(LEETCODE_LOGIN_URL, timeout=30000)
        await asyncio.sleep(5)
    except PlaywrightTimeout:
        notifier.network_error(LEETCODE_LOGIN_URL, "Login page timeout")
        return False
    
    # Check for Cloudflare
    if await detect_cloudflare(page):
        notifier.cloudflare_blocked()
        return False
    
    # Click "Login with Google"
    google_btn = page.locator('a[href*="/accounts/google/login"]')
    if await google_btn.count() == 0:
        print("  No Google login button found!")
        notifier.login_failed("Google login button not found")
        return False
    
    await google_btn.click()
    await asyncio.sleep(5)
    
    # Check if we're already logged in (auto-login from saved Google profile)
    if "leetcode.com" in page.url and "login" not in page.url.lower() and "accounts" not in page.url.lower():
        print("  ✓ Auto-logged in from saved Google profile!")
        return True
    
    # Check if we're on Google's login page
    if "accounts.google.com" not in page.url:
        # We might be on LeetCode still or somewhere else
        await asyncio.sleep(3)
        if "leetcode.com" in page.url and "login" not in page.url.lower():
            print("  ✓ Already logged in!")
            return True
    
    # Try to enter email (may already be filled or skipped)
    try:
        email_input = page.locator('input[type="email"]')
        if await email_input.count() > 0 and await email_input.is_visible():
            print("  Entering email...")
            await email_input.fill(email)
            await page.keyboard.press("Enter")
            await asyncio.sleep(5)
    except Exception as e:
        print(f"  Email step skipped: {e}")
    
    # Check if logged in after email
    if "leetcode.com" in page.url and "login" not in page.url.lower():
        print("  ✓ Logged in after email!")
        return True
    
    # Try to enter password
    try:
        password_input = page.locator('input[type="password"]')
        if await password_input.count() > 0 and await password_input.is_visible():
            print("  Entering password...")
            await password_input.fill(password)
            await page.keyboard.press("Enter")
            print("  Waiting for 2FA verification (up to 60s)...")
    except Exception as e:
        print(f"  Password step skipped: {e}")
    
    # Wait for 2FA/verification - poll every 5 seconds for up to 60 seconds
    for i in range(12):  # 12 * 5 = 60 seconds
        await asyncio.sleep(5)
        current_url = page.url
        if "leetcode.com" in current_url and "login" not in current_url.lower() and "accounts" not in current_url.lower():
            print("  ✓ Login successful!")
            return True
        print(f"  Waiting... ({(i+1)*5}s)")
    
    print(f"  Current URL: {page.url}")
    is_logged_in = "leetcode.com" in page.url and "login" not in page.url.lower()
    
    if not is_logged_in:
        notifier.login_failed("Timeout waiting for login completion")
    
    return is_logged_in


async def navigate_to_problem(page: Page, problem_number: int, problem_name: str) -> bool:
    """Navigate to a specific LeetCode problem."""
    # Convert problem name to URL slug (e.g., "Two Sum" -> "two-sum")
    slug = problem_name.lower().replace(" ", "-")
    url = f"https://leetcode.com/problems/{slug}/"
    
    print(f"  Navigating to: {url}")
    try:
        await page.goto(url, timeout=30000)
        await asyncio.sleep(5)
    except PlaywrightTimeout:
        notifier.network_error(url, "Problem page timeout")
        return False
    
    # Check for Cloudflare
    if await detect_cloudflare(page):
        notifier.cloudflare_blocked()
        return False
    
    # Check if we're on the problem page
    if "problems" in page.url.lower():
        return True
    return False


async def select_cpp_language(page: Page) -> bool:
    """Select C++ as the programming language."""
    print("  Selecting C++ language...")
    try:
        # First check if C++ is already selected
        current_lang = page.locator('button:has-text("C++")')
        if await current_lang.count() > 0:
            # Check if it's the language selector button (not dropdown item)
            btn_text = await current_lang.first.inner_text()
            if "C++" in btn_text and len(btn_text.strip()) < 10:
                print("  C++ already selected")
                return True
        
        # Click language dropdown button
        lang_btn = page.locator('button:has-text("Python"), button:has-text("Java"), button:has-text("C++"), button:has-text("Python3")')
        if await lang_btn.count() > 0:
            await lang_btn.first.click()
            await asyncio.sleep(1)
            
            # Select C++ from dropdown - be specific to avoid the button
            # Use the dropdown/dialog context
            cpp_option = page.locator('[role="dialog"] >> text=C++, [role="listbox"] >> text=C++, [role="menu"] >> text=C++')
            if await cpp_option.count() > 0:
                await cpp_option.first.click()
            else:
                # Fallback: try to find C++ option that's not the button
                all_cpp = page.locator('text=C++')
                count = await all_cpp.count()
                if count > 1:
                    # Click the second one (dropdown option, not button)
                    await all_cpp.nth(1).click()
                elif count == 1:
                    await all_cpp.click()
            
            await asyncio.sleep(1)
            return True
    except Exception as e:
        print(f"  Error selecting language: {e}")
    return False


async def insert_code(page: Page, code: str) -> bool:
    """Insert solution code into Monaco editor."""
    print("  Inserting solution code...")
    try:
        # Monaco editor uses a specific class
        # We'll use JavaScript to set the value
        js_code = f"""
        (() => {{
            // Get Monaco editor instance
            if (window.monaco && window.monaco.editor) {{
                const editors = window.monaco.editor.getEditors();
                if (editors.length > 0) {{
                    const editor = editors[0];
                    editor.setValue({repr(code)});
                    return true;
                }}
            }}
            return false;
        }})()
        """
        result = await page.evaluate(js_code)
        return result
    except Exception as e:
        print(f"  Error inserting code: {e}")
        return False


async def run_and_submit(page: Page, problem_number: int, problem_name: str) -> str:
    """
    Run code and then submit. Returns verdict string.
    """
    # Check for rate limiting before attempting submit
    if await detect_rate_limit(page):
        notifier.rate_limited()
        return "rate_limited"
    
    print("  Running code...")
    try:
        # Click Run button
        run_btn = page.locator('[data-e2e-locator="console-run-button"]')
        if await run_btn.count() > 0:
            await run_btn.click()
            await asyncio.sleep(5)
        
        print("  Submitting code...")
        # Click Submit button
        submit_btn = page.locator('[data-e2e-locator="console-submit-button"]')
        if await submit_btn.count() > 0:
            # Check if disabled (rate limited)
            if await submit_btn.is_disabled():
                notifier.rate_limited()
                return "rate_limited"
            
            await submit_btn.click()
            
            # Wait for verdict with timeout
            print("  Waiting for verdict...")
            verdict = await wait_for_verdict(page, timeout_ms=30000)
            return verdict
        else:
            return "submit_button_missing"
            
    except Exception as e:
        print(f"  Error running/submitting: {e}")
        return "submission_error"


async def solve_problem(page: Page, problem_number: int, problem_name: str) -> tuple[bool, str]:
    """
    Solve a single problem: navigate, insert code, submit.
    Returns: (success: bool, reason: str)
    """
    print(f"\n{'='*50}")
    print(f"Solving Problem #{problem_number}: {problem_name}")
    print(f"{'='*50}")
    
    # Load solution
    print("  Loading solution...")
    solution = load_solution(problem_number)
    if not solution:
        print("  ✗ No solution found, skipping...")
        notifier.no_solution_found(problem_number, problem_name)
        return False, "no_solution"
    
    # Navigate to problem
    if not await navigate_to_problem(page, problem_number, problem_name):
        print("  ✗ Failed to navigate to problem")
        return False, "navigation_failed"
    
    # Check if premium problem
    if await detect_premium_problem(page):
        print("  ✗ Premium problem detected, skipping...")
        notifier.premium_skipped(problem_number, problem_name)
        return False, "premium"
    
    # Select C++ language
    await select_cpp_language(page)
    
    # Insert code
    if not await insert_code(page, solution):
        print("  ✗ Failed to insert code")
        return False, "insert_failed"
    
    # Run and submit
    verdict = await run_and_submit(page, problem_number, problem_name)
    
    if verdict == "accepted":
        print("  ✓ Problem submitted successfully!")
        notifier.problem_solved(problem_number, problem_name)
        return True, "accepted"
    elif verdict == "stalled":
        print("  ⏳ Submission stalled - no verdict received")
        notifier.submit_stalled(problem_number, problem_name)
        return False, "stalled"
    elif verdict == "rate_limited":
        print("  🚫 Rate limited!")
        return False, "rate_limited"
    else:
        print(f"  ✗ Submission failed: {verdict}")
        notifier.problem_failed(problem_number, problem_name, verdict)
        return False, verdict


async def main():
    """Main automation function."""
    print("\n" + "=" * 60)
    print("LeetCode Daily Bot")
    print("=" * 60)
    print(f"\nProblems to solve: {PROBLEMS_PER_RUN}")
    print(f"Headless mode: {HEADLESS}")
    print()
    
    # Track session stats
    solved_this_run = 0
    skipped_this_run = 0
    failed_this_run = 0
    
    try:
        # Load progress
        solved = get_solved_set()
        print(f"Problems already solved by bot: {len(solved)}")
        
        # Get available solutions
        all_solutions = get_available_solutions()
        print(f"Total solutions available: {len(all_solutions)}")
        
        # Send start notification
        notifier.bot_started(PROBLEMS_PER_RUN, len(solved), len(all_solutions))
        
        # Find next problems to solve
        problems_to_solve = []
        for num, name, _ in all_solutions:
            if num not in solved:
                problems_to_solve.append((num, name))
                if len(problems_to_solve) >= PROBLEMS_PER_RUN:
                    break
        
        if not problems_to_solve:
            print("\n✓ All problems have been solved!")
            notifier.custom("All Done!", "No more problems to solve. Congratulations! 🎉", "🏆")
            return
        
        print(f"\nProblems to solve this run:")
        for num, name in problems_to_solve:
            print(f"  - #{num}: {name}")
        
        async with async_playwright() as p:
            context = await create_context(p)
            page = await context.new_page()
            
            # Check if logged in
            print("\nChecking login status...")
            if not await check_logged_in(page):
                print("Not logged in. Logging in via Google...")
                if not await login_with_google(page, LEETCODE_USERNAME, LEETCODE_PASSWORD):
                    print("✗ Login failed!")
                    await context.close()
                    return
                print("✓ Logged in successfully!")
                notifier.login_success()
            else:
                print("✓ Already logged in!")
            
            # Solve problems
            for num, name in problems_to_solve:
                success, reason = await solve_problem(page, num, name)
                
                if success:
                    mark_as_solved(num, name, "accepted")
                    solved_this_run += 1
                elif reason in ["premium", "no_solution"]:
                    mark_as_skipped(num, name, reason)
                    skipped_this_run += 1
                elif reason == "rate_limited":
                    # Stop the session if rate limited
                    print("\n🚫 Rate limited - stopping session")
                    failed_this_run += 1
                    break
                else:
                    mark_as_failed(num, name, reason)
                    failed_this_run += 1
                
                # Wait between problems
                await asyncio.sleep(3)
            
            # Session summary
            print("\n" + "=" * 60)
            print(f"Session Complete!")
            print(f"Problems solved: {solved_this_run}/{len(problems_to_solve)}")
            if skipped_this_run > 0:
                print(f"Problems skipped: {skipped_this_run}")
            if failed_this_run > 0:
                print(f"Problems failed: {failed_this_run}")
            print(f"Total problems solved: {get_solve_count()}")
            print("=" * 60)
            
            # Find next problem for notification
            next_problem = None
            new_solved = get_solved_set()
            for num, name, _ in all_solutions:
                if num not in new_solved:
                    next_problem = f"#{num}: {name}"
                    break
            
            # Send session complete notification
            notifier.session_complete(
                solved=solved_this_run,
                target=len(problems_to_solve),
                skipped=skipped_this_run,
                total=get_solve_count(),
                next_problem=next_problem
            )
            
            await context.close()
            
    except Exception as e:
        # Catch-all for unexpected errors
        tb = traceback.format_exc()
        print(f"\n💀 Bot crashed: {e}")
        print(tb)
        notifier.bot_crashed(str(e), tb)
        raise


if __name__ == "__main__":
    asyncio.run(main())
