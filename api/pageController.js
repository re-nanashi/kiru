'use strict';
const Browser = require('./browser');
const { MangaKatana, 
        MangaNelo, 
        AsuraScans } = require('./sites/special');


/** @brief PageController class.
 *
 *  Controls the scraper functionality to be used for the page to be scraped.
 *
 *  @constructor void
 */
class PageController {
    constructor () {
        this.browserObject = new Browser();
		this.mangaProviders = {
			mangakatana: MangaKatana,
			manganelo: MangaNelo,
			asurascans: AsuraScans,
		};
    }

    /** @brief Scrape the keyword from all the selected manga providers.
     *
     *  @param keyword keyword to scrape from a page 
     *  @param selectedMangaProviderArray user selected manga providers 
     *  @return {object} that is converted into JSON
     */
    async scrapeFull(keyword, selectedMangaProviderArray) {
        let browserInstance;

        // scrape data from the selected manga sites
        try {
            browserInstance = await this.browserObject.start();

            let scrapedData = {};
		    for (let i = 0; i < providerArray.length; i++) {
		        // instantiate mangaProvider classes that the user selected
		    	let mangasite = new mangaProviders[`${selectedMangaProviderArray[i]}`](keyword);
		    	scrapedData[`${selectedMangaProviderArray[i]}`] = await mangasite.scrape(browserInstance);
		    }

            // close browser instance
            await browserInstance.close();

		    return JSON.stringify(scrapedData);
        } catch(err) {
            console.log('Error. Cannot scrape data.', err);
        }
    }

    /** @brief Scrape the page directly.
     *
     *  @param {string} direct link of the manga
     *  @return {object} that is converted into JSON
     */
    async scrapeDirect(urlToScrape) {
        let browserInstance;

        // scrape data from the direct url that is from one of the available sites
        try {
            browserInstance = await this.browserObject.start();

		    let scrapedData = {};
		    for (const key in sites) {
		    	if (url.toString().includes(key)) {
		    		let mangasite = new mangaProviders[`${key}`]('');
		    		scrapedData[`${key}`] = await mangasite.generatePageData(urlToScrape, browserInstance);
		    	}
		    }

            // close browser instance
		    await browserInstance.close();

		    return JSON.stringify(scrapedData);
        } catch(err) {
            console.log('Error. Cannot scrape data.', err);
        }
    }
}

module.exports = PageController;
