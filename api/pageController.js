const pageScraper = require('./pageScraper');

async function scrapeAll(browserInstance, keyword) {
	let browser;
	try {
		browser = await browserInstance;
		let scrapedData = {};

		let mangaKatana = pageScraper(keyword);
		scrapedData['MangaKatana'] = await mangaKatana.scraper(browser);

		await browser.close();
		console.log(scrapedData);
	} catch (err) {
		console.log('Could not resolve the browser instance => ', err);
	}
}

module.exports = (browserInstance, keyword) =>
	scrapeAll(browserInstance, keyword);
