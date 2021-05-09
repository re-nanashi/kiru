const search = require('./pageScraper');

module.exports = async (req, res) => {
	if (req.method === 'GET') {
		const { source, keyword } = req.query;

		function formatSources(src) {
			return src.split('-');
		}

		function formatKeyword(keyword) {
			return keyword.replace(/_/g, ' ').toString();
		}

		let data = await search.launchScraper(
			formatKeyword(keyword),
			formatSources(source)
		);

		res.json(data);
	}
};
