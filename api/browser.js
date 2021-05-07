const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
//Funtion: commences chromium browser
async function startBrowser() {
	let browser;
	try {
		console.log('Opening the browser.....');
		browser = await puppeteer.launch({
			//Controls whether to manifest browser or not
			headless: false,
			args: ['--disable-setuid-sandbox'],
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
