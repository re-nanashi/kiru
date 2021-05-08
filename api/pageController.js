'use strict';

const fs = require('fs');
const { MangaKatana, MangaNelo, AsuraScans } = require('./sites/special');

//Function: controls scraper instances
async function scrapeAll(browserInstance, keyword) {
	let browser;
	try {
		browser = await browserInstance;
		let scrapedData = {};

		// let mangakatana = new MangaKatana(keyword);
		// scrapedData['mangakatana'] = await mangakatana.scraper(browser);

		// let manganelo = new MangaNelo(keyword);
		// scrapedData['manganelo'] = await manganelo.scraper(browser);

		let asurascans = new AsuraScans(keyword);
		scrapedData['asurascans'] = await asurascans.scraper(browser);

		await browser.close();
		fs.writeFile(
			'data.json',
			JSON.stringify(scrapedData),
			'utf8',
			function (err) {
				if (err) {
					return console.log(err);
				}
				console.log('ダタを収集できました！');
			}
		);
		console.log(scrapedData);
	} catch (err) {
		console.log('Could not resolve the browser instance => ', err);
	}
}

//create a dynamic browser instance *
function dynamicLoad() {}

module.exports = (browserInstance, keyword) =>
	scrapeAll(browserInstance, keyword);
