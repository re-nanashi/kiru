'use strict';

const { MangaKatana, MangaNelo, AsuraScans } = require('./sites/special');

/**
 *
 * Function: controls scraper instances
 * @param {function} browserInstance
 * @param {string} keyword - keyword query
 * @param {array} providerArray - provider select array
 * @returns {object} that is converted into JSON
 */
async function scrapeAll(browserInstance, keyword, providerArray) {
	let browser;
	try {
		browser = await browserInstance;
		let scrapedData = {};

		await dynamicClass(scrapedData);

		await browser.close();
		return JSON.stringify(scrapedData);
	} catch (err) {
		console.log('Could not resolve the browser instance => ', err);
	}

	//Dynamically instantiate class according to user selection
	async function dynamicClass(storage) {
		const sites = {
			mangakatana: MangaKatana,
			manganelo: MangaNelo,
			asurascrans: AsuraScans,
		};

		//Loop through the array to instantiate all user selection
		for (let i = 0; i < providerArray.length; i++) {
			let mangasite = new sites[`${providerArray[i]}`](keyword);
			storage[`${providerArray[i]}`] = await mangasite.scraper(browser);
		}
	}
}

module.exports = (browserInstance, keyword, providerArray) =>
	scrapeAll(browserInstance, keyword, providerArray);
