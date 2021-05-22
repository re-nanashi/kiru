const Kiru = require('../kiru');

//Subclass: specifically target mangakatana selectors
class MangaKatana extends Kiru {
	constructor(
		keyword,
		url = MangaKatana.search(keyword),
		selectors = {
			directory: ['#book_list > div', 'h3 > a'],
			title: '.info > .heading',
			image: '.cover > img',
			author: '.d-row-small > .authors',
			status: '.d-row-small > .status',
			latest: ['table.uk-table > tbody', 'a'],
			description: '.summary > p',
			next: '.next.page-numbers',
		}
	) {
		super(keyword, url, selectors);
	}

	//@override Kiru's createQueList() to cater mangakatana redirect function
	async createQueueList(page) {
		const currentUrl = await page.url();
		const redirected = !currentUrl.includes('?search=');

		if (redirected) {
			return [currentUrl];
		}

		let list = await page.$$eval('#book_list > div', (listNode) => {
			let urls = [...listNode].map((link) => link.querySelector('h3 > a').href);
			return urls;
		});

		return list;
	}

	static search(keyword) {
		let query = keyword.split(' ').join('+');
		let url = `https://mangakatana.com/?search=${query}`;

		return url;
	}
}

//Subclass: specifically target mangelo website
class MangaNelo extends Kiru {
	constructor(
		keyword,
		url = MangaNelo.search(keyword),
		selectors = {
			directory: ['.panel-search-story > div', 'div > a'],
			title: '.story-info-right > h1',
			image: '.info-image > img',
			author:
				'body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(2) > td.table-value',
			status:
				'body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(3) > td.table-value',
			latest: ['.row-content-chapter', 'a'],
			description: '#panel-story-info-description',
			next: '#navigation-ajax',
		}
	) {
		super(keyword, url, selectors);
	}

	//@overrides Kiru's getDescription() to exclusively target manganelo selectors
	async getDescription(currentPage, selector) {
		let textDescription = await currentPage.$eval(
			`#panel-story-info-description`,
			(description) => {
				description.querySelector(`h3`).remove();
				return description.textContent;
			}
		);

		// Removes unnecessary text from description
		return textDescription.replace(/\n/g, '');
	}

	static search(keyword) {
		let query = keyword.split(' ').join('_');
		let url = `https://manganelo.com/search/story/${query}`;

		return url;
	}
}

//Subclass: specifically target mangapark selectors
class AsuraScans extends Kiru {
	constructor(
		keyword,
		url = AsuraScans.search(keyword),
		selectors = {
			directory: ['.listupd > div', 'div > a'],
			title: '.entry-title',
			image: '.thumb > img',
			author: '',
			status: '.imptdt > i',
			latest: ['#chapterlist > ul', 'epcur epcurlast'],
			description: 'div.entry-content.entry-content-single > p',
			next: '.pagination > a.next',
		}
	) {
		super(keyword, url, selectors);
	}

	async getLatestChapter(currentPage) {
		let latestChapter = await currentPage.$eval(
			'.epcur.epcurlast',
			(latest) => latest.textContent
		);
		return latestChapter;
	}

	async getLatestChLink(currentPage) {
		let latestChapterLink = await currentPage.$eval(
			'div.lastend > div:nth-child(2) > a',
			(latest) => latest.href
		);
		return latestChapterLink;
	}

	static search(keyword) {
		let url = `https://www.asurascans.com/?s=${keyword}`;

		return url;
	}
}

module.exports = { MangaKatana, MangaNelo, AsuraScans };
