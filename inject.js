// Listen for messages from content script
window.addEventListener('message', function(event) {
    if (event.data.type === 'INSERT_CODE' && event.data.code) {
        console.log('Received code to insert:', event.data.code);
        setTimeout(() => {
            insertCode(event.data.code);
            // Send response back through window.postMessage
            window.postMessage({ type: 'CODE_INSERTED', status: 'success' }, '*');
        }, 3000);
    } else if (event.data.type === 'START_AUTOMATION') {
        startAutomation();
    } else if (event.data.type === 'STOP_AUTOMATION') {
        stopAutomation();
    } else if (event.data.type === 'SKIP_TO_NEXT') {
        moveToNextQuestion();
    }
});

function waitForEditor() {
    console.log('Waiting for editor to load...');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (window.monaco && window.monaco.editor) {
                const editor = window.monaco.editor.getEditors()[0];
                if (editor) {
                    observer.disconnect();
                    console.log('Editor found and ready');
                    window.postMessage({ type: 'EDITOR_READY' }, '*');
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function insertCode(code) {
    console.log('Attempting to insert code...');
    if (window.monaco && window.monaco.editor) {
        const editor = window.monaco.editor.getEditors()[0];
        if (editor) {
            editor.getModel().setValue(code);
            console.log('Code inserted successfully');
            window.postMessage({ type: 'CODE_INSERTED' }, '*');
            runCode();
        } else {
            console.log('Editor not found, waiting...');
            waitForEditor();
        }
    } else {
        console.log('Monaco not loaded yet, waiting...');
        waitForEditor();
    }
}

function runCode() {
    console.log('Attempting to run code...');
    const runButton = document.querySelector('[data-e2e-locator="console-run-button"]');
    if (runButton) {
        runButton.click();
        console.log('Run button clicked');
        window.postMessage({ type: 'CODE_RUNNING' }, '*');
        
        // Wait 5 seconds before submitting
        setTimeout(() => {
            submitCode();
        }, 5000);
    } else {
        console.log('Run button not found');
        window.postMessage({ type: 'ERROR', message: 'Run button not found' }, '*');
    }
}

function submitCode() {
    console.log('Attempting to submit code...');
    const submitButton = document.querySelector('[data-e2e-locator="console-submit-button"]');
    if (submitButton) {
        submitButton.click();
        window.postMessage({ type: 'CODE_SUBMITTED' }, '*');
        console.log('Code submitted, waiting 5 seconds before moving to next question...');
        
        // Wait 5 seconds before moving to next question
        setTimeout(() => {
            console.log('5 seconds passed, attempting to move to next question...');
            moveToNextQuestion();
        }, 5000);
    } else {
        console.log('Submit button not found');
        window.postMessage({ type: 'ERROR', message: 'Submit button not found' }, '*');
    }
}

function moveToNextQuestion() {
    console.log('Inside moveToNextQuestion function...');
    
    // Wait for the submission page to fully load
    setTimeout(() => {
        // Find the next button using the specific selector for the chevron-right icon
        const nextButtonIcon = document.querySelector('.group.cursor-pointer [data-icon="chevron-right"]');
        let nextButton = null;
        
        if (nextButtonIcon) {
            // Get the parent anchor tag which is the actual clickable button
            nextButton = nextButtonIcon.closest('.group.cursor-pointer');
            console.log('Found next button using chevron-right icon');
        }

        if (nextButton) {
            console.log('Next button found, attempting to click...');
            window.postMessage({ type: 'MOVING_TO_NEXT' }, '*');
            nextButton.click();
            
            // Wait for navigation to complete
            let navigationTimeout = setTimeout(() => {
                console.log('Navigation timeout - no new page detected');
                window.postMessage({ type: 'ERROR', message: 'Navigation timeout - failed to move to next problem' }, '*');
            }, 10000);
            
            // Check for URL change
            let lastUrl = window.location.href;
            const urlCheck = setInterval(() => {
                if (window.location.href !== lastUrl && !window.location.href.includes('submissions')) {
                    console.log('URL changed to new problem:', window.location.href);
                    clearInterval(urlCheck);
                    clearTimeout(navigationTimeout);
                    
                    // Wait for editor to be ready
                    const editorCheck = setInterval(() => {
                        const editor = window.monaco?.editor?.getModels()[0];
                        if (editor) {
                            console.log('New page editor detected');
                            clearInterval(editorCheck);
                            window.postMessage({ type: 'NEW_PAGE_READY', problemInfo: getCurrentProblemInfo() }, '*');
                        }
                    }, 500);
                }
            }, 500);
        } else {
            console.log('Next button not found - could not find chevron-right icon');
            window.postMessage({ type: 'ERROR', message: 'Next button not found - Please ensure you are on a problem page' }, '*');
        }
    }, 2000); // Wait 2 seconds for submission page to load
}

function getCurrentProblemInfo() {
    const pathMatch = window.location.pathname.match(/\/problems\/([^/]+)/);
    const problemName = pathMatch ? pathMatch[1].replace(/\/(description|submissions).*$/, '') : null;
    return problemName ? { name: problemName } : null;
}

function waitForNewPage() {
    console.log('Waiting for new page to load...');
    let checkCount = 0;
    const maxChecks = 10;
    
    const checkInterval = setInterval(() => {
        checkCount++;
        if (checkCount > maxChecks) {
            clearInterval(checkInterval);
            window.postMessage({ type: 'ERROR', message: 'New page load timeout' }, '*');
            return;
        }

        // Check if we're on a new page and editor is loading
        if (window.monaco && window.monaco.editor) {
            const editor = window.monaco.editor.getEditors()[0];
            if (editor) {
                clearInterval(checkInterval);
                console.log('New page loaded and editor ready');
                window.postMessage({ type: 'NEW_PAGE_READY' }, '*');
            }
        }
    }, 1000); // Check every second
}

function startAutomation() {
    console.log('Starting automation...');
}

function stopAutomation() {
    console.log('Stopping automation...');
}

// Initialize editor check
console.log('Inject script loaded, checking for editor...');
if (window.monaco && window.monaco.editor) {
    const editor = window.monaco.editor.getEditors()[0];
    if (editor) {
        console.log('Editor found immediately');
        window.postMessage({ type: 'EDITOR_READY' }, '*');
    } else {
        console.log('Editor not found, starting observer...');
        waitForEditor();
    }
} else {
    console.log('Monaco not loaded, starting observer...');
    waitForEditor();
}
