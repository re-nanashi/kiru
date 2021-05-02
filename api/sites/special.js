function mangaKatana(keyword) {
	return {
		keyword,

		searchKeywordUrl() {
			let query = keyword.split(' ').join('+');
			let url = `https://mangakatana.com/?search=${query}`;

			return url;
		},
	};
}

exports.mangaKatana = mangaKatana;
