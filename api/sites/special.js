const Kiru = require('../kiru');

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

	static search(keyword) {
		let query = keyword.split(' ').join('+');
		let url = `https://mangakatana.com/?search=${query}`;

		return url;
	}
}

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

	async getDescription(currentPage, selector) {
		let text = await currentPage.$$eval(
			`${selector}`,
			(description) => description.textContent
		);
		let formated = [];
		text.forEach((text) => {
			formated.push(text);
		});
	}

	static search(keyword) {
		let query = keyword.split(' ').join('_');
		let url = `https://manganelo.com/search/story/${query}`;

		return url;
	}
}

module.exports = MangaNelo;
