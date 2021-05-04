const browserObject = require('./browser');
const scraperController = require('./pageController');

function launchScraper(keyword) {
	let browserInstance = browserObject.startBrowser();

	scraperController(browserInstance, keyword); //<< 2 parameters another for url 1 time lang din
}

exports.launchScraper = launchScraper;
