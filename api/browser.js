/** @brief Brower class.
 *
 *  Creates a browser instance for executing the scraper.
 *
 *  @constructor void
 *  @return returns a promise which resolves to browser instance
 */
class Browser {
    constructor() {
        this.chrome = {};
        this.puppeteer;
        this.browser_instance;

        // Define the chrome and puppeteer variable
        if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        	// running on the Vercel platform.
        	chrome = require('chrome-aws-lambda');
        	puppeteer = require('puppeteer-core');
        } else {
        	// running locally.
        	puppeteer = require('puppeteer');
        }
    }

    /** @brief Starts the browser instance.
     *
     *  @constructor void
     *  @return returns a promise which resolves to browser instance
     */
    async start() {
        // Launch browser instance
	    try {
	    	browser_instance = await puppeteer.launch({
	    		args: chrome.args,
	    		defaultViewport: chrome.defaultViewport,
	    		executablePath: await chrome.executablePath,
	    		headless: true,
	    		ignoreHTTPSErrors: true,
	    	});
	    } catch (err) {
	    	console.log('Could not create a browser instance => :', err);
	    }

	    return browser_instance;
    }
}

module.exports = {
	Browser,
};
