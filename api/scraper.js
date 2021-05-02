const browserObject = require('./browser');
const scraperController = require('./pageController');

//make a function that instantiate for every url with the code above and export as scraper function to be called on index.js

function launchScraper(keyword) {
	let browserInstance = browserObject.startBrowser();

	scraperController(browserInstance, keyword); //<< 2 parameters another for url 1 time lang din
}

exports.launchScraper = launchScraper;
