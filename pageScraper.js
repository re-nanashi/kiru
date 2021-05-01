const scraperObject = {
	url: 'https://mangakatana.com/manga',
	async scraper(browser) {
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url);

		let scrapedData = [];

		async function scrapeCurrentPage() {
			await page.waitForSelector('#wrap_content');

			let urls = await page.$$eval('#book_list > div', (links) => {
				links = links.filter(
					(el) =>
						el.querySelector('.media > .status').textContent === ' Ongoing'
				);
				links = links.map((el) => el.querySelector(`h3 > a`).href);
				return links;
			});
			console.log(urls);

			let pagePromise = (link) =>
				new Promise(async (resolve, reject) => {
					let dataObj = {};
					let newPage = await browser.newPage();
					await newPage.goto(link);

					dataObj['mangaTitle'] = await newPage.$eval(
						'.info > h1',
						(text) => text.textContent
					);

					dataObj['mangaImage'] = await newPage.$eval(
						'.cover img',
						(img) => img.src
					);

					dataObj['mangaStatus'] = await newPage.$eval(
						'.d-row-small > .status',
						(div) => div.textContent
					);

					dataObj['mangaLatest'] = await newPage.$eval(
						'table > tbody',
						(table) => {
							let currentChapter;
							let textContent = table.firstElementChild.querySelector(
								'.chapter > a'
							).textContent;

							if (textContent.includes(':')) {
								let array = textContent.split(':');
								currentChapter = array[0];
								return currentChapter;
							}

							currentChapter = textContent;
							return currentChapter;
						}
					);

					dataObj['latestChapterLink'] = await newPage.$eval(
						'table > tbody',
						(table) =>
							table.firstElementChild.querySelector('.chapter > a').href
					);

					resolve(dataObj);
					await newPage.close();
				});

			for (link in urls) {
				let currentPageData = await pagePromise(urls[link]);
				scrapedData.push(currentPageData);
				console.log(currentPageData);
			}

			let nextButtonExist = false;
			try {
				const nextButton = await page.$eval(
					'.next.page-numbers',
					(a) => a.textContent
				);
				nextButtonExist = true;
			} catch (err) {
				nextButtonExist = false;
			}

			if (nextButtonExist) {
				await page.click('.next.page-numbers');
				return scrapeCurrentPage();
			}
			await page.close();
			return scrapedData;
		}
		let data = await scrapeCurrentPage();
		console.log(data);
		return data;
	},
};

module.exports = scraperObject;
