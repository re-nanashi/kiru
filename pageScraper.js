const scraperObject = {
	url: 'https://mangakatana.com/manga',
	async scraper(browser) {
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url);

		await page.waitForSelector('#wrap_content');

		let urls = await page.$$eval('#book_list > div', (links) => {
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
					'.d-row-small > .new_chap',
					(div) => div.textContent
				);
				dataObj['latestChapterLink'] = await newPage.$eval('');
			});
	},
};

module.exports = scraperObject;

//https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer
