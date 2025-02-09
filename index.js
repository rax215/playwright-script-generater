const { chromium } = require('playwright');
const GeminiAPI = require('./geminiApi');

// Create an instance
const gemini = new GeminiAPI(process.env.GEMINI_API_KEY);

async function scanWebPage(url, prompt) {
    // Launch the browser
    const browser = await chromium.launch();
    
    try {
        // Create a new context and page
        const context = await browser.newContext();
        const page = await context.newPage();

        // Navigate to the URL
        console.log(`Navigating to ${url}...`);
        await page.goto(url);

        // Get the HTML source code
        const htmlContent = await page.content();

        // Use the methods
const playwrightScript = await gemini.analyzeHtml(htmlContent, prompt);
console.log('\nPlaywright Script Generated');
return playwrightScript;
        
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Close the browser
        await browser.close();
    }
}

module.exports = {scanWebPage};

