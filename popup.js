document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const copyBtn = document.getElementById('copyBtn');
    const promptInput = document.getElementById('promptInput');
    const currentUrlElement = document.getElementById('currentUrl');
    const responseContainer = document.getElementById('responseContainer');
    const responseText = document.getElementById('responseText');
    const loading = document.getElementById('loading');

    // Get current tab URL
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url;
        currentUrlElement.textContent = `URL: ${currentUrl}`;
    });

    // Close button handler
    closeBtn.addEventListener('click', function() {
        window.close();
    });

    // Cancel button handler
    cancelBtn.addEventListener('click', function() {
        promptInput.value = '';
        responseContainer.style.display = 'none';
    });

    // Copy button handler
    copyBtn.addEventListener('click', function() {
        const code = responseText.textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text:', err);
            alert('Failed to copy text to clipboard');
        });
    });

    // Submit button handler
    submitBtn.addEventListener('click', function() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        // Show loading indicator
        loading.style.display = 'block';
        responseContainer.style.display = 'none';
        submitBtn.disabled = true;

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const url = tabs[0].url;
            
            // Send data to your Node.js server
            fetch('http://localhost:3000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    prompt: prompt
                })
            })
            .then(response => response.json())
            .then(data => {
                // Hide loading indicator
                loading.style.display = 'none';
                submitBtn.disabled = false;

                if (data.success) {
                    // Display the response
                    responseText.textContent = data.result;
                    responseContainer.style.display = 'block';
                } else {
                    throw new Error(data.error || 'Failed to generate code');
                }
            })
            .catch(error => {
                // Hide loading indicator
                loading.style.display = 'none';
                submitBtn.disabled = false;

                console.error('Error:', error);
                alert('Error generating code. Please try again.');
            });
        });
    });
});
