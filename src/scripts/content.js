// Announce content script is ready
console.log('LeetCode Automation content script loaded');

function isLeetCodeProblemPage() {
    return window.location.href.includes('leetcode.com/problems/');
}

function injectScript() {
    console.log('Injecting script...');
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = () => {
        console.log('Inject script loaded');
        script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

// Function to get problem information from the page
function getProblemInfo() {
    console.log('Getting problem info from page');
    const pathname = window.location.pathname;
    console.log('Current pathname:', pathname);
    
    // Extract problem name from URL
    const match = pathname.match(/\/problems\/([^/]+)/);
    if (!match) {
        console.log('No problem found in URL');
        return null;
    }
    
    const problemName = match[1];
    console.log('Found problem:', problemName);
    
    return {
        name: problemName
    };
}

// Keep track of last problem to avoid duplicate updates
let lastProblemName = null;

// Function to update popup with current problem info
function updatePopupWithProblemInfo() {
    const problemInfo = getProblemInfo();
    if (!problemInfo) return;

    // Only send update if problem has changed
    if (problemInfo.name !== lastProblemName) {
        console.log('Problem changed from', lastProblemName, 'to', problemInfo.name);
        lastProblemName = problemInfo.name;
        chrome.runtime.sendMessage({
            action: 'UPDATE_PROBLEM_INFO',
            problemInfo: problemInfo
        });
    } else {
        console.log('Problem unchanged, skipping update');
    }
}

// Listen for URL changes
let lastUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
        console.log('URL changed from', lastUrl, 'to', window.location.href);
        lastUrl = window.location.href;
        // Wait for page to settle before updating
        setTimeout(() => {
            updatePopupWithProblemInfo();
        }, 1000);
    }
});

// Start observing URL changes
urlObserver.observe(document.querySelector('body'), {
    childList: true,
    subtree: true
});

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    
    if (message.action === 'GET_PROBLEM_INFO') {
        const problemInfo = getProblemInfo();
        sendResponse({ success: true, problemInfo });
    }
    else if (message.action === 'INSERT_CODE') {
        // Inject the code insertion script
        const script = document.createElement('script');
        script.textContent = `
            window.postMessage({
                type: 'INSERT_CODE',
                code: ${JSON.stringify(message.code)}
            }, '*');
        `;
        document.documentElement.appendChild(script);
        script.remove();
        sendResponse({ success: true });
    }
    else if (message.action === 'test-connection') {
        sendResponse({ success: true });
    }
    else if (message.action === 'start-automation') {
        console.log('Starting automation with solution:', message.solution);
        window.postMessage({ 
            type: 'INSERT_CODE',
            code: message.solution
        }, '*');
        sendResponse({ status: 'Code insertion started' });
    }
    else if (message.action === 'getProblemInfo') {
        const info = getProblemInfo();
        console.log('Sending problem info back:', info);
        sendResponse(info);
    }
    
    return true; // Keep the message channel open for async responses
});

// Listen for messages from the injected script
window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    
    if (event.data.type === 'CODE_SUBMITTED') {
        console.log('Code has been submitted');
        chrome.runtime.sendMessage({ action: 'CODE_SUBMITTED' });
    }
    else if (event.data.type === 'MOVING_TO_NEXT') {
        console.log('Moving to next question');
        chrome.runtime.sendMessage({ action: 'MOVING_TO_NEXT' });
    }
    else if (event.data.type === 'NEW_PAGE_READY') {
        console.log('New page is ready');
        updatePopupWithProblemInfo(); // Update problem info when new page is ready
        chrome.runtime.sendMessage({ 
            action: 'NEW_PAGE_READY',
            problemInfo: getProblemInfo()
        });
    }
    else if (event.data.type === 'ERROR') {
        console.error('Error from injected script:', event.data.message);
        chrome.runtime.sendMessage({ 
            action: 'AUTOMATION_ERROR',
            message: event.data.message
        });
    }
    else if (event.data.type === 'EDITOR_READY') {
        console.log('Editor is ready, notifying popup');
        chrome.runtime.sendMessage({ action: 'editor-ready' });
    } 
    else if (event.data.type === 'CODE_INSERTED') {
        console.log('Code insertion confirmed');
        chrome.runtime.sendMessage({ action: 'code-inserted' });
    }
    else if (event.data.type === 'CODE_RUNNING') {
        console.log('Code is running');
        chrome.runtime.sendMessage({ action: 'code-running' });
    }
});

async function loadSolution() {
    const problem = await getProblemInfo();
    if (!problem) return;

    // Generate different possible name formats
    const nameVariations = [];
    const baseName = problem.name.toLowerCase();
    
    // Original name as is
    nameVariations.push(problem.name);
    
    // Capitalize first letter of each word, keep dash
    const dashCapitalized = baseName.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
    nameVariations.push(dashCapitalized);

    // Capitalize first letter of each word, with space
    const spaceCapitalized = baseName.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    nameVariations.push(spaceCapitalized);

    // Handle roman numerals and special cases
    const romanNumeralRegex = /^(.*?)(?: ?(I{1,3}|IV|V|VI{0,3}|IX|X))?$/i;
    
    // Try variations with the base name
    const baseVariations = [
        baseName,                          // n-queens
        dashCapitalized,                   // N-Queens
        spaceCapitalized,                  // N Queens
        baseName.charAt(0).toUpperCase() + baseName.slice(1), // N-queens
        baseName.replace(/-/g, ' '),       // n queens
        baseName.replace(/-/g, ''),        // nqueens
        dashCapitalized.replace(/-/g, ''), // NQueens
    ];

    // Add all base variations
    nameVariations.push(...baseVariations);

    // For each base variation, if it has roman numerals, add more variations
    baseVariations.forEach(variant => {
        const match = variant.match(romanNumeralRegex);
        if (match && match[2]) {
            const [_, base, numeral] = match;
            // Add variations with different separators for roman numerals
            nameVariations.push(`${base}-${numeral}`);
            nameVariations.push(`${base} ${numeral}`);
            nameVariations.push(`${base}${numeral}`);
            // Try with lowercase numeral too
            nameVariations.push(`${base}-${numeral.toLowerCase()}`);
            nameVariations.push(`${base} ${numeral.toLowerCase()}`);
            nameVariations.push(`${base}${numeral.toLowerCase()}`);
        }
    });

    // Remove duplicates and empty strings
    const uniqueVariations = [...new Set(nameVariations)].filter(Boolean);
    console.log('Trying variations for problem:', problem.name);
    console.log('Generated variations:', uniqueVariations);

    // Try each variation
    for (const variation of uniqueVariations) {
        const folderPath = `solutions/${getProblemFolder(problem.number)}/${problem.number}.${variation}`;
        const solutionPath = `${folderPath}/Solution.cpp`;
        console.log('Attempting path:', solutionPath);
        
        try {
            const response = await fetch(chrome.runtime.getURL(solutionPath));
            if (response.ok) {
                console.log('Solution found at:', solutionPath);
                const solution = await response.text();
                return solution;
            }
        } catch (error) {
            console.log('Failed for variation:', variation);
            continue;
        }
    }

    // If no variation worked, notify that solution was not found
    console.log('No solution found after trying all variations');
    chrome.runtime.sendMessage({ 
        action: 'SOLUTION_NOT_FOUND',
        variations: uniqueVariations // Send the tried variations for debugging
    });
    return null;
}

// Initial problem info update
updatePopupWithProblemInfo();

// Initial check and script injection
if (isLeetCodeProblemPage()) {
    console.log('This is a LeetCode problem page.');
    injectScript();
} else {
    console.log('This is not a LeetCode problem page.');
}

// Notify that content script is ready
chrome.runtime.sendMessage({ action: 'content-script-ready' });
