const browserObject = require('./browser');
const scraperController = require('./pageController');

//Function: launches scraper
function launchScraper(keyword) {
	let browserInstance = browserObject.startBrowser();

	scraperController(browserInstance, keyword);
}

exports.launchScraper = launchScraper;
