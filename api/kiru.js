//Class: Main scraper class
class Kiru {
	/**
	 * Create specific instances to target website
	 * @param {string} keyword - query/search keyword
	 * @param {string} url - 	specific url for keyword search
	 * @param {object} selectors - exclusive selectors for diffrent sites
	 */
	constructor(keyword, url = null, selectors = {}) {
		this.keyword = keyword;
		this._url = url;
		this._selectors = selectors;
	}

	/**
	 * Function: main function for web scraping
	 * @param {function} browser - browser instance as parameter
	 * @returns {array} - Scraped data
	 */

	async scraper(browser) {
		let page = await browser.newPage();
		await page.goto(this._url);
		console.log(`Navigating to ${this._url}`);

		let scrapedData = [];

		let data = await this.scrapeCurrentPage(browser, page, scrapedData);
		return data;
	}

	/**
	 * Function: scrapes current page
	 * @param {function} browser instance
	 * @param {function} page instance
	 * @param {array} scrapedData storage
	 * @returns {array} current page data
	 */
	async scrapeCurrentPage(browser, page, scrapedData) {
		await page.waitForSelector('body');

		let queueList = await this.createQueueList(page);

		for (let link in queueList) {
			let currentPageData = await this.pagePromise(queueList[link], browser);
			scrapedData.push(currentPageData);
		}

		//Use Recursion to traverse pagination
		let nextButtonExist = false;

		try {
			//Evaluates page if there is a next button
			const nextButton = await page.$eval(`${this._selectors['next']}`);
			nextButtonExist = true;
		} catch (err) {
			nextButtonExist = false;
		}

		if (nextButtonExist) {
			await page.click(`${this._selectors.next}`);
			return this.scrapeCurrentPage(page);
		}

		await page.close();
		return scrapedData;
	}

	//Function: creates and returns a list of links from search results
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
			this._selectors['directory'][0],
			this._selectors['directory'][1]
		);

		return list;
	}

	/**
	 *
	 * @param {string} link for every elements of an array
	 * @param {function} browser instance
	 * @returns {object} data from page
	 */
	pagePromise = (link, browser) =>
		new Promise(async (resolve, reject) => {
			let dataObj = {};
			let newPage = await browser.newPage();
			await newPage.goto(link);

			dataObj['link'] = link;
			dataObj['title'] = await this.getTitle(newPage, this._selectors.title);
			dataObj['image'] = await this.getImage(newPage, this._selectors.image);
			dataObj['status'] = await this.getStatus(newPage, this._selectors.status);
			dataObj['latest'] = await this.getLatestChapter(
				newPage,
				this._selectors['latest']
			);
			dataObj['latestLink'] = await this.getLatestChLink(
				newPage,
				this._selectors['latest']
			);
			dataObj['description'] = await this.getDescription(
				newPage,
				this._selectors.description
			);

			resolve(dataObj);
			await newPage.close();
		});

	async getTitle(currentPage, selector) {
		return await currentPage.$eval(`${selector}`, (node) => node.textContent);
	}

	async getImage(currentPage, selector) {
		return await currentPage.$eval(`${selector}`, (image) => {
			return image.src;
		});
	}

	async getStatus(currentPage, selector) {
		return await currentPage.$eval(
			`${selector}`,
			(status) => status.textContent
		);
	}

	//Gets latest chapter from chapter list
	async getLatestChapter(currentPage, selector) {
		const [list, linkPath] = selector;
		let latest;
		let latestChapter = await currentPage.evaluate(
			(list, link) => {
				const latestChapter = document.querySelector(`${list}`);
				const chapterNumber = latestChapter.querySelector(`${link}`)
					.textContent;

				//Checks if chapter has unnecessary text
				if (chapterNumber.includes(':')) {
					let arr = chapterNumber.split(':');
					latest = arr[0];
					return latest;
				}
				return chapterNumber;
			},
			list,
			linkPath
		);
		return latestChapter;
	}

	async getLatestChLink(currentPage, selector) {
		const [list, linkPath] = selector;
		let latestChapter = await currentPage.evaluate(
			(list, link) => {
				const latestChapter = document.querySelector(`${list}`);
				const chapterLink = latestChapter.querySelector(`${link}`).href;

				return chapterLink;
			},
			list,
			linkPath
		);
		return latestChapter;
	}

	async getDescription(currentPage, selector) {
		return await currentPage.$eval(
			`${selector}`,
			(description) => description.textContent
		);
	}
}

module.exports = Kiru;
