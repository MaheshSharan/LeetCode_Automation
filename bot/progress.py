"""
Progress tracker - keeps track of which problems have been solved with detailed info
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Set, Optional
from .config import PROGRESS_FILE


def load_progress() -> Dict:
    """Load the full progress data from file."""
    if not PROGRESS_FILE.exists():
        return {"solved": {}, "stats": {"total_solved": 0, "last_run": None}}
    
    try:
        return json.loads(PROGRESS_FILE.read_text())
    except (json.JSONDecodeError, KeyError):
        return {"solved": {}, "stats": {"total_solved": 0, "last_run": None}}


def save_progress(data: Dict) -> None:
    """Save the progress data to file."""
    PROGRESS_FILE.parent.mkdir(parents=True, exist_ok=True)
    PROGRESS_FILE.write_text(json.dumps(data, indent=2))


def get_solved_set() -> Set[int]:
    """Get just the set of solved problem numbers."""
    data = load_progress()
    return set(int(k) for k in data.get("solved", {}).keys())


def is_solved(problem_number: int) -> bool:
    """Check if a specific problem has been solved."""
    return problem_number in get_solved_set()


def mark_as_solved(problem_number: int, problem_name: str, status: str = "accepted") -> None:
    """
    Mark a specific problem as solved with full details.
    
    Args:
        problem_number: The problem number (e.g., 1 for Two Sum)
        problem_name: The problem name (e.g., "Two Sum")
        status: Submission status ("accepted", "wrong_answer", "runtime_error", etc.)
    """
    data = load_progress()
    
    # Add detailed entry for this problem
    data["solved"][str(problem_number)] = {
        "name": problem_name,
        "number": problem_number,
        "solved_at": datetime.now().isoformat(),
        "status": status,
    }
    
    # Update stats
    data["stats"]["total_solved"] = len(data["solved"])
    data["stats"]["last_run"] = datetime.now().isoformat()
    
    save_progress(data)
    print(f"✓ Marked problem #{problem_number} ({problem_name}) as {status}")


def mark_as_failed(problem_number: int, problem_name: str, error: str) -> None:
    """Mark a problem as attempted but failed."""
    data = load_progress()
    
    # Store in a separate "failed" section (won't be skipped, can retry later)
    if "failed" not in data:
        data["failed"] = {}
    
    data["failed"][str(problem_number)] = {
        "name": problem_name,
        "number": problem_number,
        "last_attempt": datetime.now().isoformat(),
        "error": error,
    }
    
    save_progress(data)
    print(f"✗ Problem #{problem_number} ({problem_name}) failed: {error}")


def mark_as_skipped(problem_number: int, problem_name: str, reason: str) -> None:
    """Mark a problem as skipped (premium or no solution)."""
    data = load_progress()
    
    # Store in "skipped" section - these are expected to be skipped
    if "skipped" not in data:
        data["skipped"] = {}
    
    data["skipped"][str(problem_number)] = {
        "name": problem_name,
        "number": problem_number,
        "skipped_at": datetime.now().isoformat(),
        "reason": reason,  # "premium" or "no_solution"
    }
    
    # Also add to solved set so we don't retry
    data["solved"][str(problem_number)] = {
        "name": problem_name,
        "number": problem_number,
        "solved_at": datetime.now().isoformat(),
        "status": f"skipped_{reason}",
    }
    
    save_progress(data)
    print(f"⏭️ Problem #{problem_number} ({problem_name}) skipped: {reason}")


def get_solve_count() -> int:
    """Get total number of problems solved by the bot."""
    return len(get_solved_set())


def get_progress_summary() -> str:
    """Get a formatted summary of progress."""
    data = load_progress()
    solved = data.get("solved", {})
    stats = data.get("stats", {})
    
    lines = [
        f"Total Solved: {len(solved)}",
        f"Last Run: {stats.get('last_run', 'Never')}",
        "",
        "Recently Solved:",
    ]
    
    # Show last 5 solved problems
    if solved:
        sorted_problems = sorted(
            solved.items(), 
            key=lambda x: x[1].get("solved_at", ""), 
            reverse=True
        )[:5]
        
        for num, info in sorted_problems:
            lines.append(f"  #{num}: {info.get('name', '?')} - {info.get('status', '?')}")
    else:
        lines.append("  (none)")
    
    return "\n".join(lines)


if __name__ == "__main__":
    print("=" * 50)
    print("Progress Summary")
    print("=" * 50)
    print(get_progress_summary())
    print()
    print(f"Solved problem numbers: {sorted(get_solved_set())}")
