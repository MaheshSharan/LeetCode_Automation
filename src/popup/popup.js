document.addEventListener('DOMContentLoaded', function() {
  const statusText = document.getElementById('status-text');
  const refreshBtn = document.getElementById('refresh-btn');
  const problemName = document.getElementById('problem-name');
  const loadSolutionBtn = document.getElementById('load-solution');
  const codeSection = document.querySelector('.code-section');
  const codeDisplay = document.getElementById('code-display');
  const copyBtn = document.getElementById('copy-btn');

  let currentProblem = null;

  function updateProblemInfo(problem) {
    console.log('Updating problem info for:', problem);
    
    // Get problem number from our mapping
    const number = getProblemNumber(problem);
    console.log('Found problem number:', number);
    
    currentProblem = {
      name: problem,
      number: number
    };

    // Update UI
    problemName.textContent = problem.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Only enable load button if we have a valid problem number
    loadSolutionBtn.disabled = !number;

    console.log('Current problem updated:', currentProblem);
  }

  // Check if we're on a LeetCode problem page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    console.log('Current URL:', url);

    // Extract problem name from URL, handling both with and without /description
    const problemMatch = url.match(/leetcode\.com\/problems\/([^/]+)/);
    if (!problemMatch) {
      console.log('Not on a LeetCode problem page');
      problemName.textContent = 'Not on a LeetCode problem page';
      loadSolutionBtn.disabled = true;
      return;
    }

    const problem = problemMatch[1].replace(/\/(description)?$/, '');
    console.log('Found problem in URL:', problem);
    updateProblemInfo(problem);
  });

  // Check for solution folder
  function checkSolutionFolder() {
    statusText.textContent = 'Checking for solution folder...';
    statusText.classList.remove('success-text');
    
    console.log('Sending checkSolutionFolder message');
    chrome.runtime.sendMessage({ action: "checkSolutionFolder" }, response => {
      console.log('Got folder check response:', response);
      if (response && response.exists) {
        statusText.textContent = 'Solution folder found!';
        statusText.classList.add('success-text');
      } else {
        statusText.textContent = 'Solution folder not found';
        statusText.classList.remove('success-text');
      }
    });
  }

  // Refresh button click handler
  refreshBtn.addEventListener('click', checkSolutionFolder);

  // Load solution button click handler
  loadSolutionBtn.addEventListener('click', function() {
    console.log('Load solution clicked, current problem:', currentProblem);
    
    if (!currentProblem || !currentProblem.number) {
      console.error('No problem number available');
      codeSection.style.display = 'block';
      codeDisplay.textContent = '// Error: Could not detect problem number';
      return;
    }

    // Get the range folder (e.g., '0000-0099')
    const range = getProblemRange(currentProblem.number);
    if (!range) {
      console.error('Could not determine problem range');
      codeSection.style.display = 'block';
      codeDisplay.textContent = '// Error: Could not determine problem range';
      return;
    }

    console.log('Loading solution for problem:', currentProblem, 'in range:', range);
    chrome.runtime.sendMessage({
      action: "loadSolution",
      problemNumber: currentProblem.number,
      problemName: currentProblem.name,
      range: range
    }, response => {
      console.log('Got solution response:', response);
      if (response && response.success) {
        codeSection.style.display = 'block';
        codeDisplay.textContent = response.content;
      } else {
        codeSection.style.display = 'block';
        codeDisplay.textContent = `// ${response?.error || 'Failed to load solution'}`;
      }
    });
  });

  // Copy button click handler
  copyBtn.addEventListener('click', function() {
    const code = codeDisplay.textContent;
    navigator.clipboard.writeText(code).then(() => {
      copyBtn.querySelector('.material-icons').textContent = 'check';
      setTimeout(() => {
        copyBtn.querySelector('.material-icons').textContent = 'content_copy';
      }, 2000);
    });
  });

  // Initial check for solution folder
  checkSolutionFolder();
});
