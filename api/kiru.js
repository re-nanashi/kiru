//Class: Main scraper class
class Kiru {
	constructor(keyword, source = null, url = null, selectors = {}) {
		this.keyword = keyword;
		this.source = source;
		this._url = url;
		this._selectors = selectors;
	}

	async scraper(browser) {
		let page = await browser.newPage();
		console.log(`Navigation to ${this._url}...`);
		await page.goto(this._url);

		//idea deconstruct title > description and make another functio
		// to make a direct scraper for saved mangas;
		let { directory, next } = this._selectors;

		let scrapedData = [];
		//check if redirects to main page and skip this;
		async function scrapeCurrentPage() {
			await page.waitForSelector('body');

			let [mangaList, directLink] = directory;
			let urls = await page.$$eval(`${mangaList}`, (links) => {
				links = links.map((el) => el.querySelector(`${directLink}`).href);
				return links;
			});

			let pagePromise = (link) =>
				new Promise(async (resolve, reject) => {
					let dataObj = {};
					let newPage = await browser.newPage();
					await newPage.goto(link);

                    //creates an object
					this.createObj(dataObj, link);

					resolve(dataObj);
					await newPage.close();
				});

			//loop all manga links inside mangalist url
			for (link in urls) {
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

	createObj(object, link) {
		let { title, image, status, latest, description } = this._selectors;
        let [chapterList, chapterLink] = latest

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
	}
}

module.exports = Kiru;