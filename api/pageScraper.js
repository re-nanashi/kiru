//import special from manga katana class
const sites = require('./sites/special');

/**
 *
 * will need to make an algorithm for different sites
 * will need to factor if page automatically goes to manga page
 * will need to factor if page didn't see a result << special for mangakatana
 */

const scraperObject = (keyword) => {
	let source = sites.mangaKatana(keyword); //<< will change
	let _url = source.searchKeywordUrl(); //<< will change depending on site

	/**
	 * class extends scraper object super 'keyword'
	 * then add source depending on site
	 * also this.source
	 * also this._url depending sa source
	 *
	 * in every inheritance there is a different function that help with queris
	 *
	 * this._selectors = {   depending sa site pero since mangakatana is main
	 * 		directory : [manga list urls, link path],
	 *		title: title path
	 		image: img path
			status: status path
			latest: latest path
			description: description path
			next: next button path
	 *
	 * }
	 *
	 * then method scraper(browser, obj )
	 *
	 *
	 *
	 * }
	 */
	return {
		async scraper(browser, selectors = this._selectors) {
			let page = await browser.newPage();
			console.log(`Navigating to ${_url}...`);
			await page.goto(_url);

			let scrapedData = [];

			async function scrapeCurrentPage() {
				await page.waitForSelector('body');

				let urls = await page.$$eval('#book_list > div', (links) => {
					links = links.filter(
						(el) =>
							el.querySelector('.media > .status').textContent === ' Ongoing'
					);
					links = links.map((el) => el.querySelector(`h3 > a`).href);
					return links;
				});
				// console.log(urls);

				let pagePromise = (link) =>
					new Promise(async (resolve, reject) => {
						let dataObj = {};
						let newPage = await browser.newPage();
						await newPage.goto(link);

						//Will have to make a function to accomodate several sites according to this
						dataObj['mangaLink'] = link;

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

						dataObj['description'] = await newPage.$x(
							'//*[@id="single_book"]/div[3]/p',
							(p) => p.textContent
						);

						resolve(dataObj);
						await newPage.close();
					});

				for (link in urls) {
					let currentPageData = await pagePromise(urls[link]);
					scrapedData.push(currentPageData); //<< pushes current page data to an array scraped Data
					// console.log(currentPageData); //<< logs data from current page individual
				}

				let nextButtonExist = false;
				try {
					const nextButton = await page.$eval(
						'.next.page-numbers',
						(button) => button.textContent
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
			let data = await scrapeCurrentPage(); //returns scrapedData
			// console.log(data);
			return data; //<< returns an array; json file
		},
	};
};

module.exports = scraperObject;
