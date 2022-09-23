const Scraper = require('./PageController');

module.exports = async (req, res) => {
	try {
		const { source, keyword } = req.query;

		function formatKeyword(keyword) {
			return keyword.replace(/_/g, ' ').toString();
		}

		function formatSources(src) {
			return src.split('-');
		}


        let kiru = new Scraper();
		let data = await kiru.scrapeFull(
			formatKeyword(keyword),
			formatSources(source)
		);

		res.json(data);
	} catch (error) {
		return res.status(400).json({ 'Kiru Main': 'simple manga scraper' });
	}
};
