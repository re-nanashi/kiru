'use strict';

const MangaKatana = require('./sites/special');

async function scrapeAll(browserInstance, keyword) {
	let browser;
	try {
		browser = await browserInstance;
		let scrapedData = {};

		let test = new MangaKatana(keyword);
		scrapedData['mangakatana'] = await test.scraper(browser);

		await browser.close();
		console.log(scrapedData);
	} catch (err) {
		console.log('Could not resolve the browser instance => ', err);
	}
}

module.exports = (browserInstance, keyword) =>
	scrapeAll(browserInstance, keyword);
