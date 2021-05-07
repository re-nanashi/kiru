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
			status: '.d-row-small > .status',
			latest: ['table.uk-table > tbody', 'a'],
			description: '.summary > p',
			next: '.next.page-numbers',
		}
	) {
		super(keyword, url, selectors);
	}

	//override Kiru's createQueList() to cater mangakatana redirect function
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
class MangaPark extends Kiru {
	constructor(
		keyword,
		url = MangaPark.search(keyword),
		selectors = {
			directory: ['#search-list > div', 'div > a'],
			title: 'h3.item-title > a',
			image: '.attr-cover > img',
			status:
				'#mainer > div > div.row.detail-set > div.col-24.col-sm-16.col-md-18.mt-4.mt-sm-0.attr-main > div:nth-child(6) > span',
			latest: ['#episodes-latest', 'a'],
			description: '.limit-html',
			next:
				'#mainer > div > div.my-5.ml-auto.d-flex.justify-content-end > nav.d-none.d-md-block > ul > li:nth-child(8) > a',
		}
	) {
		super(keyword, url, selectors);
	}

	static search(keyword) {
		let query = keyword.split(' ').join('+');
		let url = `https://mangapark.net/search?word=${query}`;

		return url;
	}
}

module.exports = { MangaKatana, MangaNelo, MangaPark };
