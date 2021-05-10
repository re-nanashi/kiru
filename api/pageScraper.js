const browserObject = require('./browser');
const { scrapeAll, scrapeDirect } = require('./pageController');

//Function: launches scraper
function launchFullScraper(keyword, providerArray) {
	let browserInstance = browserObject.startBrowser();

	return scrapeAll(browserInstance, keyword, providerArray);
}

function launchDirectScraper(url) {
	let browserInstance = browserObject.startBrowser();

	return scrapeDirect(browserInstance, url);
}

module.exports = { launchFullScraper, launchDirectScraper };
