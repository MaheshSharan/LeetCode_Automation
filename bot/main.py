"""
LeetCode Daily Bot - Main Automation Script
Solves LeetCode problems sequentially using pre-existing C++ solutions.
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright, Page, BrowserContext

from .config import (
    LEETCODE_LOGIN_URL,
    LEETCODE_USERNAME,
    LEETCODE_PASSWORD,
    HEADLESS,
    PROJECT_ROOT,
    PROBLEMS_PER_RUN,
)
from .solution_loader import load_solution, get_available_solutions
from .progress import get_solved_set, mark_as_solved, mark_as_failed, get_solve_count, get_progress_summary

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
    return "login" not in page.url.lower() and "accounts" not in page.url.lower()


async def login_with_google(page: Page, email: str, password: str) -> bool:
    """Login to LeetCode using Google OAuth. Handles auto-login from saved profile."""
    print("Logging in via Google OAuth...")
    
    await page.goto(LEETCODE_LOGIN_URL)
    await asyncio.sleep(5)
    
    # Click "Login with Google"
    google_btn = page.locator('a[href*="/accounts/google/login"]')
    if await google_btn.count() == 0:
        print("  No Google login button found!")
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
    return "leetcode.com" in page.url and "login" not in page.url.lower()


async def navigate_to_problem(page: Page, problem_number: int, problem_name: str) -> bool:
    """Navigate to a specific LeetCode problem."""
    # Convert problem name to URL slug (e.g., "Two Sum" -> "two-sum")
    slug = problem_name.lower().replace(" ", "-")
    url = f"https://leetcode.com/problems/{slug}/"
    
    print(f"  Navigating to: {url}")
    await page.goto(url)
    await asyncio.sleep(5)
    
    # Check if we're on the problem page
    if "problems" in page.url.lower():
        return True
    return False


async def select_cpp_language(page: Page) -> bool:
    """Select C++ as the programming language."""
    print("  Selecting C++ language...")
    try:
        # Click language dropdown
        lang_btn = page.locator('button:has-text("Python"), button:has-text("Java"), button:has-text("C++")')
        if await lang_btn.count() > 0:
            await lang_btn.first.click()
            await asyncio.sleep(1)
            
            # Select C++
            cpp_option = page.locator('text=C++')
            await cpp_option.click()
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


async def run_and_submit(page: Page) -> bool:
    """Run code and then submit."""
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
            await submit_btn.click()
            await asyncio.sleep(8)
            return True
    except Exception as e:
        print(f"  Error running/submitting: {e}")
    return False


async def solve_problem(page: Page, problem_number: int, problem_name: str) -> bool:
    """Solve a single problem: navigate, insert code, submit."""
    print(f"\n{'='*50}")
    print(f"Solving Problem #{problem_number}: {problem_name}")
    print(f"{'='*50}")
    
    # Load solution
    print("  Loading solution...")
    solution = load_solution(problem_number)
    if not solution:
        print("  ✗ No solution found, skipping...")
        return False
    
    # Navigate to problem
    if not await navigate_to_problem(page, problem_number, problem_name):
        print("  ✗ Failed to navigate to problem")
        return False
    
    # Select C++ language
    await select_cpp_language(page)
    
    # Insert code
    if not await insert_code(page, solution):
        print("  ✗ Failed to insert code")
        return False
    
    # Run and submit
    if not await run_and_submit(page):
        print("  ✗ Failed to submit")
        return False
    
    print("  ✓ Problem submitted successfully!")
    return True


async def main():
    """Main automation function."""
    print("\n" + "=" * 60)
    print("LeetCode Daily Bot")
    print("=" * 60)
    print(f"\nProblems to solve: {PROBLEMS_PER_RUN}")
    print(f"Headless mode: {HEADLESS}")
    print()
    
    # Load progress
    solved = get_solved_set()
    print(f"Problems already solved by bot: {len(solved)}")
    
    # Get available solutions
    all_solutions = get_available_solutions()
    print(f"Total solutions available: {len(all_solutions)}")
    
    # Find next problems to solve
    problems_to_solve = []
    for num, name, _ in all_solutions:
        if num not in solved:
            problems_to_solve.append((num, name))
            if len(problems_to_solve) >= PROBLEMS_PER_RUN:
                break
    
    if not problems_to_solve:
        print("\n✓ All problems have been solved!")
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
        else:
            print("✓ Already logged in!")
        
        # Solve problems
        solved_this_run = 0
        for num, name in problems_to_solve:
            success = await solve_problem(page, num, name)
            if success:
                mark_as_solved(num, name, "accepted")
                solved_this_run += 1
            else:
                mark_as_failed(num, name, "submission_failed")
            
            # Wait between problems
            await asyncio.sleep(3)
        
        print("\n" + "=" * 60)
        print(f"Session Complete!")
        print(f"Problems solved this run: {solved_this_run}/{len(problems_to_solve)}")
        print(f"Total problems solved: {get_solve_count()}")
        print("=" * 60)
        
        await context.close()


if __name__ == "__main__":
    asyncio.run(main())
