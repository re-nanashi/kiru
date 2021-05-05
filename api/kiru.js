//Class: Main scraper class
class Kiru {
	constructor(keyword, url = null, selectors = {}) {
		this.keyword = keyword;
		this._url = url;
		this._selectors = selectors;
	}

	async scraper(browser) {
		let page = await browser.newPage();
		await page.goto(this._url);

		let scrapedData = [];

		let data = await this.scrapeCurrentPage(browser, page, scrapedData);
		return data;
	}

	async scrapeCurrentPage(browser, page, scrapedData) {
		await page.waitForSelector('body');

		let queueList = await this.createQueueList(page);

		for (let link in queueList) {
			let currentPageData = await this.pagePromise(queueList[link], browser);
			scrapedData.push(currentPageData);
		}

		let nextButtonExist = false;

		try {
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

	async createQueueList(page) {
		let list = await page.evaluate(
			(parentSelector, linkPath) => {
				const listContainer = document.querySelectorAll(`${parentSelector}`);
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

	async getLatestChapter(currentPage, selector) {
		const [list, linkPath] = selector;
		let latest;
		let latestChapter = await currentPage.evaluate(
			(list, link) => {
				const latestChapter = document.querySelector(`${list}`);
				const chapterNumber = latestChapter.querySelector(`${link}`)
					.textContent;

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
