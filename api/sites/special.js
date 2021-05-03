const Kiru = require('../kiru');

class MangaKatana extends Kiru {
	constructor(
		keyword,
		url = MangaKatana.search(keyword),
		selectors = {
			directory: ['#book_list > div', 'h3 > a'],
			title: '//*[@id="single_book"]/div[2]/div/h1',
			image: '//*[@id="single_book"]/div[1]/div/img',
			status: '//*[@id="single_book"]/div[2]/div/ul/li[4]/div[2]',
			latest: ['//*[@id="single_book"]/div[7]/table/tbody', 'chapter > a'],
			description: '//*[@id="single_book"]/div[3]/p',
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

// function mangaKatana(keyword) {
// 	return {

// this._selectors = {   depending sa site pero since mangakatana is main
// 	* 		directory : [manga list urls, link path],
// 	*		title: title path
// 			image: img path
// 		   status: status path
// 		   latest: latest path
// 		   description: description path
// 		   next: next button path
// 	*
// 	* }
// 		keyword,

// 		searchKeywordUrl() {
// 			let query = keyword.split(' ').join('+');
// 			let url = `https://mangakatana.com/?search=${query}`;

// 			return url;
// 		},
// 	};
// }

module.exports = MangaKatana;
