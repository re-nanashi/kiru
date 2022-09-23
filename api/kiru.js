"use strict";
const PageObject = require("./pageObject");

//Class: Main scraper class
class Kiru {
	/**
	 * Create specific instances to target website
	 * @param {string} keyword - query/search keyword
	 * @param {string} url - 	specific url for keyword search
	 * @param {object} selectors - exclusive selectors for diffrent sites
	 */
	constructor(keyword = null, url = null, selectors = {}) {
		this.keyword = keyword;
		this._url = url;
		this._selectors = selectors;
	}

	/**
	 * Function: main function for web scraping
	 * @param {function} browser - browser instance as parameter
	 * @returns {array} - Scraped data
	 */

	async scrape(browser) {
		let page = await browser.newPage();
		await page.goto(this._url);

		// await page.waitForNavigation();
		console.log(`Navigating to ${this._url}`);

		let scrapedData = [];
		let data = await scrapeCurrentPage(browser, page, scrapedData);

		return data;
	}

	/**
	 * Function: scrapes current page
	 * @param {function} browser instance
	 * @param {function} page instance
	 * @param {array} scrapedData storage
	 * @returns {array} current page data
	 */
	async scrapeCurrentPage(browser, page, scrapedDataStorage) {
		await page.waitForSelector("body");

		try {
			let queueList = await createQueueList(page);

			// generate page data from every link
			for (let link in queueList) {
				let currentPageData = await this.generatePageData(
					queueList[link],
					browser
				);
				scrapedDataStorage.push(currentPageData);
			}
		} catch (err) {
			console.log("Error on creating a queueList:", err);
		}

		// use recursion to traverse pagination
		let nextButtonExist = false;
		try {
			// evaluates the page if there is a next button element
			const nextButton = await page.$eval(
				`${this._selectors.next}`,
				(a) => a.textContent
			);

			// if await did not catch any error, assign true
			nextButtonExist = true;
		} catch (err) {
			// if the promise encouters an error/null, assign false
			nextButtonExist = false;
		}

		if (nextButtonExist) {
			await page.click(`${this._selectors.next}`);
			return this.scrapeCurrentPage(page);
		}
		await page.close();

		return scrapedDataStorage;
	}

	/** @brief Creates and returns a list of links {string} from search results.
	 *
	 *  @param {object} a page object
	 *  @returns {array} queuelist of manga page links to scrape
	 */
	async createQueueList(page) {
		let list = await page.evaluate(
			(parentSelector, linkPath) => {
				const listContainer = document.querySelectorAll(`${parentSelector}`);

				//Maps all listnodes to create href array
				let urls = [...listContainer].map(
					(link) => link.querySelector(`${linkPath}`).href
				);

				return urls;
			},
			this._selectors["directory"][0],
			this._selectors["directory"][1]
		);

		return list;
	}

	/**
	 *
	 * @param {string} link for every elements of an array
	 * @param {function} browser instance
	 * @returns {object} data from page
	 */
	generatePageData = (link, browser) =>
		new Promise(async (resolve, reject) => {
			let newPage = await browser.newPage();
			await newPage.goto(link);
			await newPage.waitForSelector("body");

			let currentPage = new PageObject(link, newPage, this._selectors);
			let dataObj = currentPage.generateMangaDataObject();

			resolve(dataObj);
			await newPage.close();
		});
}

module.exports = Kiru;
