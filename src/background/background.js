// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  const extensionUrl = chrome.runtime.getURL('');
  console.log('Extension URL:', extensionUrl);

  if (request.action === "checkSolutionFolder") {
    // Check if solutions folder exists by trying to fetch a known solution
    fetch(chrome.runtime.getURL('solutions/0000-0099/0001.Two Sum/Solution.cpp'))
      .then(response => {
        console.log('Folder check response:', response);
        sendResponse({ exists: response.ok });
      })
      .catch(error => {
        console.error('Error checking solution folder:', error);
        sendResponse({ exists: false });
      });
    return true;
  }

  if (request.action === "loadSolution") {
    const { problemNumber, problemName, range } = request;
    
    // Convert kebab-case to Title Case for folder name
    const formattedName = problemName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Construct the solution path using the range
    const solutionPath = `solutions/${range}/${problemNumber}.${formattedName}/Solution.cpp`;
    console.log('Loading solution from:', solutionPath);
    
    fetch(chrome.runtime.getURL(solutionPath))
      .then(response => {
        if (!response.ok) throw new Error('Solution not found');
        return response.text();
      })
      .then(content => {
        console.log('Solution loaded successfully');
        sendResponse({ success: true, content });
      })
      .catch(error => {
        console.error('Error loading solution:', error);
        sendResponse({ 
          success: false, 
          error: `Solution not found at path: ${solutionPath}` 
        });
      });
    return true;
  }

  if (request.action === "generateProblemMap") {
    generateProblemMap().then(map => {
      console.log('Generated problem map:', map);
      saveProblemMap(map);
      sendResponse({ success: true });
    }).catch(error => {
      console.error('Error generating problem map:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});

// Function to generate problem mapping from solution folder
async function generateProblemMap() {
  const map = new Map();
  
  try {
    // Try to fetch the 0000-0099 directory first
    const response = await fetch(chrome.runtime.getURL('solutions/0000-0099/'));
    if (!response.ok) {
      throw new Error('Could not access solutions folder');
    }

    // We'll focus on 0000-0099 folder for now
    const folderPath = 'solutions/0000-0099/';
    const dirResponse = await fetch(chrome.runtime.getURL(folderPath));
    const text = await dirResponse.text();
    
    // Parse the directory listing (this is a simple way, might need adjustment)
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = doc.querySelectorAll('a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '../') return;
      
      // Extract problem number and name from folder name
      const match = href.match(/(\d{4})\.(.+?)\/$/);
      if (match) {
        const [_, number, name] = match;
        map.set(number, name.replace(/%20/g, ' '));
      }
    });
  } catch (error) {
    console.error('Error generating map:', error);
    throw error;
  }
  
  return map;
}

// Function to save problem mapping to a file
async function saveProblemMap(map) {
  let content = '# LeetCode Problem Mapping\n# Format: Number=Problem Name\n\n';
  
  for (const [number, name] of map) {
    content += `${number}=${name}\n`;
  }

  // Create a blob and download it
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // Create and click a download link
  const a = document.createElement('a');
  a.href = url;
  a.download = 'problem_map.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Log when background script loads
console.log('Background script loaded');
