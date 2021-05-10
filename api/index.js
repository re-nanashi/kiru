const search = require('./pageScraper');

module.exports = async (req, res) => {
	try {
		const { source, keyword } = req.query;

		function formatSources(src) {
			return src.split('-');
		}

		function formatKeyword(keyword) {
			return keyword.replace(/_/g, ' ').toString();
		}

		let data = await search.launchFullScraper(
			formatKeyword(keyword),
			formatSources(source)
		);

		res.json(data);
	} catch (error) {
		return res.status(400).json({ 'Kiru Main': 'simple manga scraper' });
	}
};
