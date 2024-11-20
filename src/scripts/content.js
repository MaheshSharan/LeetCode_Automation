// Log when content script is loaded
console.log('LeeCode Automation content script loaded');

// Function to extract problem info from the page
function getProblemInfo() {
  console.log('Getting problem info from page');
  
  // Try multiple ways to get the problem number
  let problemNumber = '';
  
  // Method 1: From URL
  const pathname = window.location.pathname;
  console.log('Current pathname:', pathname);
  
  const urlMatch = pathname.match(/problems\/(\d+)\./);
  if (urlMatch) {
    problemNumber = urlMatch[1];
    console.log('Found problem number from URL:', problemNumber);
  }

  // Method 2: From question title
  if (!problemNumber) {
    const titleElement = document.querySelector('div[data-cy="question-title"]');
    console.log('Title element:', titleElement);
    
    if (titleElement) {
      const titleText = titleElement.textContent.trim();
      console.log('Title text:', titleText);
      
      const match = titleText.match(/^(\d+)\./);
      if (match) {
        problemNumber = match[1];
        console.log('Found problem number from title:', problemNumber);
      }
    }
  }

  // Method 3: From URL path segments
  if (!problemNumber) {
    const pathSegments = pathname.split('/').filter(Boolean);
    console.log('Path segments:', pathSegments);
    
    for (const segment of pathSegments) {
      if (/^\d+$/.test(segment)) {
        problemNumber = segment;
        console.log('Found problem number from path segment:', problemNumber);
        break;
      }
    }
  }

  // Get the problem title
  let problemTitle = '';
  const titleElement = document.querySelector('div[data-cy="question-title"]');
  if (titleElement) {
    problemTitle = titleElement.textContent.trim();
    // Remove problem number prefix if present
    problemTitle = problemTitle.replace(/^\d+\.\s*/, '');
    console.log('Found problem title:', problemTitle);
  }

  const result = {
    title: problemTitle,
    number: problemNumber
  };
  console.log('Returning problem info:', result);
  return result;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Content script received message:', request);

    if (request.action === "getProblemInfo") {
      const info = getProblemInfo();
      console.log('Sending problem info back:', info);
      sendResponse(info);
    }
    
    return true; // Keep the message channel open for async response
  }
);

// Initial problem info extraction
console.log('Running initial problem info extraction');
const initialInfo = getProblemInfo();
console.log('Initial problem info:', initialInfo);
