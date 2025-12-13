"""
Solution loader - loads C++ solutions from the solutions folder
"""
import os
import re
from pathlib import Path
from typing import Optional, Tuple
from .config import SOLUTIONS_DIR, get_problem_range


def get_available_solutions() -> list[Tuple[int, str, Path]]:
    """
    Scan solutions folder and return list of available solutions.
    Returns: List of (problem_number, problem_name, solution_path)
    """
    solutions = []
    
    for range_dir in sorted(SOLUTIONS_DIR.iterdir()):
        if not range_dir.is_dir() or not re.match(r"\d{4}-\d{4}", range_dir.name):
            continue
            
        for problem_dir in sorted(range_dir.iterdir()):
            if not problem_dir.is_dir():
                continue
                
            # Parse folder name: "0001.Two Sum"
            match = re.match(r"(\d{4})\.(.+)", problem_dir.name)
            if not match:
                continue
                
            problem_num = int(match.group(1))
            problem_name = match.group(2)
            
            # Check for Solution.cpp
            solution_file = problem_dir / "Solution.cpp"
            if solution_file.exists():
                solutions.append((problem_num, problem_name, solution_file))
    
    return solutions


def load_solution(problem_number: int) -> Optional[str]:
    """
    Load solution code for a specific problem number.
    Returns the C++ code as a string, or None if not found.
    """
    range_folder = get_problem_range(problem_number)
    range_path = SOLUTIONS_DIR / range_folder
    
    if not range_path.exists():
        print(f"Range folder not found: {range_path}")
        return None
    
    # Find the problem folder (format: "0001.Problem Name")
    problem_prefix = f"{problem_number:04d}."
    
    for item in range_path.iterdir():
        if item.is_dir() and item.name.startswith(problem_prefix):
            solution_file = item / "Solution.cpp"
            if solution_file.exists():
                return solution_file.read_text(encoding="utf-8")
            else:
                print(f"Solution.cpp not found in {item}")
                return None
    
    print(f"Problem folder not found for problem {problem_number}")
    return None


def get_next_unsolved_problem(solved_problems: set[int]) -> Optional[Tuple[int, str]]:
    """
    Get the next problem that hasn't been solved yet (sequential order).
    Returns (problem_number, problem_name) or None if all solved.
    """
    solutions = get_available_solutions()
    
    for problem_num, problem_name, _ in solutions:
        if problem_num not in solved_problems:
            return (problem_num, problem_name)
    
    return None


if __name__ == "__main__":
    # Test: List first 10 available solutions
    print("Scanning solutions folder...")
    solutions = get_available_solutions()
    print(f"Found {len(solutions)} solutions")
    print("\nFirst 10 solutions:")
    for num, name, path in solutions[:10]:
        print(f"  {num:04d}. {name}")
