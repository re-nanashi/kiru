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

		let { directory, next } = this._selectors;
		let [mangaListItems, directLink] = directory;

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

					//creates an object
					await createObj(dataObj, link);

					resolve(dataObj);
					await newPage.close();
				});

			let createObj = async (object, link) => {
				let { title, image, status, latest, description } = this._selectors;
				let [chapterList, chapterLink] = latest;

				object['link'] = link;

				object['title'] = await newPage.$x(
					`${title}`,
					(title) => title.textContent
				);

				object['image'] = await newPage.$x(`${image}`, (img) => img.src);

				object['status'] = await newPage.$x(`${status}`, status.textContent);

				object['latest'] = await newPage.$x(`${chapterList}`, (table) => {
					let currentChapter;
					let textContent = table.firstElementChild.querySelector(
						`${chapterLink}`
					).textContent;

					if (textContent.includes(':')) {
						let chapter = textContent.split(':');
						currentChapter = chapter[0];
						return currentChapter;
					}

					currentChapter = textContent;
					return currentChapter;
				});

				object['latestLink'] = await newPage.$x(
					`${chapterList}`,
					(table) =>
						table.firstElementChild.querySelector(`${chapterLink}`).href
				);

				object['description'] = await newPage.$x(
					`${description}`,
					(p) => p.textContent
				);
			};

			//loop all manga links inside mangalist url
			for (let link in urls) {
				let currentPageData = await pagePromise(urls[link]);
				scrapedData.push(currentPageData);
			}

			//Use Recursion to traverse pagination
			let nextButtonExist = false;
			try {
				const nextButton = await page.$x(`${next}`, (a) => a.textContent);

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
