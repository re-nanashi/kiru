/** @brief Start browser instance.
 *
 *  @param void
 *  @return returns a promise which resolves to browser instance
 */
async function startBrowser() {
    // Initialize parameters
    let chrome = {};
    let puppeteer;

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    	// running on the Vercel platform.
    	chrome = require('chrome-aws-lambda');
    	puppeteer = require('puppeteer-core');
    } else {
    	// running locally.
    	puppeteer = require('puppeteer');
    }

    // Create browser instance
	let browser;
	try {
		browser = await puppeteer.launch({
			args: chrome.args,
			defaultViewport: chrome.defaultViewport,
			executablePath: await chrome.executablePath,
			headless: true,
			ignoreHTTPSErrors: true,
		});
	} catch (err) {
		console.log('Could not create a browser instance => :', err);
	}

	return browser;
}

module.exports = {
	startBrowser,
};
