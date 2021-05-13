const search = require('./pageScraper');

module.exports = async (req, res) => {
	try {
		const { url } = req.query;

		if (url !== undefined) {
			let data = await search.launchDirectScraper(formatURL(url));
			res.json(data);

			function formatURL(url) {
				//Check if http is used then slice
				if (url.includes(`http://`)) {
					return `https://${url.slice(7).toString()}`;
				}

				if (!url.includes(`https://`)) {
					return `https://${url}`;
				}

				return url.toString();
			}
		} else {
			throw new Error(`err`);
		}
	} catch (error) {
		return res.status(400).json({ 'Kiru Direct': 'simple manga scraper' });
	}
};
