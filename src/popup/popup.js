// Function to test connection with content script
async function testContentScriptConnection(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { action: 'test-connection' });
    return response && response.success;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

// Function to wait for content script to be ready
async function waitForContentScript(tabId, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    const isConnected = await testContentScriptConnection(tabId);
    if (isConnected) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

document.addEventListener('DOMContentLoaded', function() {
  const statusText = document.getElementById('status-text');
  const refreshBtn = document.getElementById('refresh-btn');
  const problemNameElement = document.getElementById('problem-name');
  const loadSolutionBtn = document.getElementById('load-solution');
  const codeSection = document.querySelector('.code-section');
  const codeDisplay = document.getElementById('code-display');
  const copyBtn = document.getElementById('copy-btn');
  const startAutomationBtn = document.getElementById('start-automation');
  const stopAutomationBtn = document.getElementById('stop-automation');
  const automationMessage = document.getElementById('automation-message');
  const progressIndicator = document.querySelector('.progress-indicator');

  let currentProblem = null;
  let isAutomating = false;
  let currentTab = null;

  function updateProblemInfo(problem) {
    console.log('Updating problem info for:', problem);
    if (!problem) return;

    const problemName = problem.name || problem;
    console.log('Processing problem name:', problemName);
    
    currentProblem = {
      name: problemName,
      number: getProblemNumber(problemName)
    };

    // Format the problem name for display
    const formattedName = problemName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Update UI elements
    problemNameElement.textContent = formattedName;
    loadSolutionBtn.disabled = !currentProblem.number;
    
    // Hide code section when problem changes
    codeSection.style.display = 'none';
    codeDisplay.textContent = '';
    
    console.log('Current problem updated:', currentProblem);
  }

  function updateAutomationStatus(message, isError = false) {
    console.log('Automation status:', message, isError ? '(error)' : '');
    automationMessage.textContent = message;
    automationMessage.style.color = isError ? 'var(--error-color)' : 'var(--text-color)';
  }

  function toggleAutomationControls(isRunning) {
    console.log('Toggling automation controls:', isRunning ? 'running' : 'stopped');
    startAutomationBtn.disabled = isRunning;
    stopAutomationBtn.disabled = !isRunning;
    progressIndicator.style.display = isRunning ? 'flex' : 'none';
    isAutomating = isRunning;
  }

  async function startNextProblem() {
    if (!isAutomating || !currentProblem) {
      console.log('Automation stopped or no current problem');
      return;
    }

    try {
      console.log('Starting next problem automation');
      const range = getProblemRange(currentProblem.number);
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'loadSolution',
          problemNumber: currentProblem.number,
          problemName: currentProblem.name,
          range: range
        }, response => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });

      if (!response.success) {
        throw new Error('Failed to load solution: ' + response.error);
      }

      console.log('Starting automation with solution');
      await chrome.tabs.sendMessage(currentTab.id, {
        action: 'start-automation',
        solution: response.content
      });

      updateAutomationStatus('Code insertion started for problem ' + currentProblem.number);
    } catch (error) {
      console.error('Automation error:', error);
      updateAutomationStatus(error.message, true);
      toggleAutomationControls(false);
    }
  }

  // Check if we're on a LeetCode problem page
  chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
    currentTab = tabs[0];
    const url = currentTab.url;
    console.log('Current URL:', url);

    if (url.includes('leetcode.com/problems/')) {
      try {
        const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'GET_PROBLEM_INFO' });
        if (response && response.problemInfo) {
          updateProblemInfo(response.problemInfo);
        } else {
          problemNameElement.textContent = 'Could not get problem info';
          loadSolutionBtn.disabled = true;
        }
      } catch (error) {
        console.error('Error getting problem info:', error);
        problemNameElement.textContent = 'Error getting problem info';
        loadSolutionBtn.disabled = true;
      }
    } else {
      problemNameElement.textContent = 'Not on a LeetCode problem page';
      loadSolutionBtn.disabled = true;
    }
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

  // Button handlers
  refreshBtn.addEventListener('click', checkSolutionFolder);

  loadSolutionBtn.addEventListener('click', function() {
    console.log('Load solution clicked, current problem:', currentProblem);
    
    if (!currentProblem || !currentProblem.number) {
      console.error('No problem number available');
      codeSection.style.display = 'block';
      codeDisplay.textContent = '// Error: Could not detect problem number';
      return;
    }

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

  copyBtn.addEventListener('click', function() {
    const code = codeDisplay.textContent;
    navigator.clipboard.writeText(code).then(() => {
      copyBtn.querySelector('.material-icons').textContent = 'check';
      setTimeout(() => {
        copyBtn.querySelector('.material-icons').textContent = 'content_copy';
      }, 2000);
    });
  });

  startAutomationBtn.addEventListener('click', async function() {
    if (!currentProblem || !currentProblem.number) {
      updateAutomationStatus('Please navigate to a LeetCode problem first', true);
      return;
    }

    toggleAutomationControls(true);
    updateAutomationStatus('Starting automation...');

    try {
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      currentTab = tabs[0];
      if (!currentTab) {
        throw new Error('No active tab found');
      }

      const isConnected = await waitForContentScript(currentTab.id);
      if (!isConnected) {
        throw new Error('Failed to connect to page. Please refresh and try again.');
      }

      await startNextProblem();
    } catch (error) {
      console.error('Automation error:', error);
      updateAutomationStatus(error.message, true);
      toggleAutomationControls(false);
    }
  });

  stopAutomationBtn.addEventListener('click', function() {
    toggleAutomationControls(false);
    updateAutomationStatus('Automation stopped by user');
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Popup received message:', message);

    if (message.action === 'UPDATE_PROBLEM_INFO') {
        console.log('Updating problem info:', message.problemInfo);
        updateProblemInfo(message.problemInfo);
    }
    else if (message.action === 'SOLUTION_NOT_FOUND') {
        console.log('Solution not found, skipping to next problem');
        updateAutomationStatus('Solution not found, skipping to next problem...');
        if (isAutomating) {
            chrome.tabs.sendMessage(currentTab.id, { action: 'SKIP_TO_NEXT' });
        }
    }
    else if (message.action === 'editor-ready') {
        console.log('Editor is ready');
        updateAutomationStatus('Editor ready');
    } 
    else if (message.action === 'code-inserted') {
        console.log('Code insertion confirmed');
        updateAutomationStatus('Code inserted successfully, running code...');
    }
    else if (message.action === 'code-running') {
        console.log('Code is running');
        updateAutomationStatus('Code is running, waiting 5 seconds...');
    }
    else if (message.action === 'CODE_SUBMITTED') {
        console.log('Code has been submitted');
        updateAutomationStatus('Code submitted, waiting for next problem...');
    }
    else if (message.action === 'MOVING_TO_NEXT') {
        console.log('Moving to next question');
        updateAutomationStatus('Moving to next problem...');
    }
    else if (message.action === 'NEW_PAGE_READY') {
        console.log('New page is ready with problem:', message.problemInfo);
        if (message.problemInfo) {
            updateProblemInfo(message.problemInfo);
            updateAutomationStatus('Successfully moved to next problem');
            if (isAutomating) {
                // Add delay before starting next problem
                setTimeout(() => {
                    console.log('Starting next problem after delay');
                    startNextProblem();
                }, 3000);
            }
        }
    }
    else if (message.action === 'AUTOMATION_ERROR') {
        console.error('Automation error:', message.message);
        updateAutomationStatus(message.message, true);
        toggleAutomationControls(false);
    }
  });

  // Initial check for solution folder
  checkSolutionFolder();
});
