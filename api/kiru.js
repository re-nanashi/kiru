//Class: Main scraper class
class Kiru {
	constructor(keyword, url = null, selectors = {}) {
		this.keyword = keyword;
		this._url = url;
		this._selectors = selectors;
	}

	async scraper(browser) {
		let page = await browser.newPage();
		console.log(`Navigation to ${this._url}...`);
		await page.goto(this._url);

		const { directory, next } = this._selectors;
		const [mangaListItems, directLink] = directory;
		const { title, image, status, latest, description } = this._selectors;
		const [chapterList, chapterLink] = latest;

		let scrapedData = [];

		async function scrapeCurrentPage() {
			await page.waitForSelector('body');

			let urls = await page.evaluate(
				(parentSelector, directLink) => {
					let mangaList = document.querySelectorAll(`${parentSelector}`);
					let links = [...mangaList].map(
						(el) => el.querySelector(`${directLink}`).href
					);
					return links;
				},
				mangaListItems,
				directLink
			);

			let pagePromise = (link) =>
				new Promise(async (resolve, reject) => {
					let dataObj = {};
					let newPage = await browser.newPage();
					await newPage.goto(link);

					dataObj['link'] = link;

					dataObj['title'] = await newPage.$eval(
						`${title}`,
						(title) => title.textContent
					);

					dataObj['image'] = await newPage.$eval(`${image}`, (img) => img.src);

					dataObj['status'] = await newPage.$eval(
						`${status}`,
						(status) => status.textContent
					);

					dataObj['latest'] = await newPage.evaluate(
						(chapterList, chapterLink) => {
							const list = document.querySelector(`${chapterList}`);
							const direct = list.querySelector(`${chapterLink}`).textContent;
							let currentChapter;

							if (direct.includes(':')) {
								let array = direct.toString().split(':');
								currentChapter = array[0];
								return currentChapter;
							}

							return direct.toString();
						},
						chapterList,
						chapterLink
					);

					dataObj['latestLink'] = await newPage.evaluate(
						(chapterList, chapterLink) => {
							const latest = document.querySelector(`${chapterList}`);
							const link = latest.querySelector(`${chapterLink}`);

							return link.href;
						},
						chapterList,
						chapterLink
					);

					dataObj['description'] = await newPage.$eval(
						`${description}`,
						(p) => p.textContent
					);

					resolve(dataObj);
					await newPage.close();
				});

			//loop all manga links inside mangalist url
			for (let link in urls) {
				let currentPageData = await pagePromise(urls[link]);
				scrapedData.push(currentPageData);
				console.log(currentPageData);
			}

			//Use Recursion to traverse pagination
			let nextButtonExist = false;
			try {
				const nextButton = await page.$eval(`${next}`, (a) => a.textContent);

				nextButtonExist = true;
			} catch (err) {
				nextButtonExist = false;
			}

			if (nextButtonExist) {
				await page.click(`${next}`);
				return scrapeCurrentPage();
			}

			await page.close();
			return scrapedData;
		}

		let data = await scrapeCurrentPage();
		return data; //returns array
	}
}

module.exports = Kiru;
