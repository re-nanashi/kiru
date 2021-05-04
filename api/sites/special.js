const Kiru = require('../kiru');

class MangaKatana extends Kiru {
	constructor(
		keyword,
		url = MangaKatana.search(keyword),
		selectors = {
			directory: ['#book_list > div', 'h3 > a'],
			title: '.info > h1',
			image: '.cover img',
			status: '.d-row-small > .status',
			latest: ['tbody', 'a'],
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

class NightComic extends Kiru {
	constructor(
		keyword,
		url = NightComic.search(keyword),
		selectors = {
			directory: [
				'body > div.wrap > div > div.site-content > div.c-page-content > div > div > div > div > div.main-col-inner > div > div.tab-content-wrap > div',
				'div > a',
			],
			title: '.post-title > h1',
			image:
				'body > div.wrap > div > div.site-content > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_image > a > img',
			status:
				'body > div.wrap > div > div.site-content > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div:nth-child(2) > div.summary-content',
			latest: ['.main', 'a'],
			description: 'description-summary',
			next: '#navigation-ajax',
		}
	) {
		super(keyword, url, selectors);
	}

	static search(keyword) {
		let query = keyword.split(' ').join('+');
		let url = `https://www.nightcomic.com/?s=${query}&post_type=wp-manga`;

		return url;
	}
}

module.exports = MangaKatana;
