'use strict';

const { MangaKatana, MangaNelo } = require('./sites/special');

//Function: controls scraper instances
async function scrapeAll(browserInstance, keyword) {
	let browser;
	try {
		browser = await browserInstance;
		let scrapedData = {};

		let mangakatana = new MangaKatana(keyword);
		scrapedData['mangakatana'] = await mangakatana.scraper(browser);

		let manganelo = new MangaNelo(keyword);
		scrapedData['manganelo'] = await manganelo.scraper(browser);

		await browser.close();
		console.log(scrapedData);
	} catch (err) {
		console.log('Could not resolve the browser instance => ', err);
	}
}

//create a dynamic browser instance *
function dynamicLoad() {}

module.exports = (browserInstance, keyword) =>
	scrapeAll(browserInstance, keyword);
