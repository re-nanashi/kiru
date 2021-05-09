const browserObject = require('./browser');
const scraperController = require('./pageController');

//Function: launches scraper
function launchScraper(keyword, providerArray) {
	let browserInstance = browserObject.startBrowser();

	scraperController(browserInstance, keyword, providerArray);
}

exports.launchScraper = launchScraper;
