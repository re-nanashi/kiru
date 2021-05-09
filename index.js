const express = require('express');
const app = express();
const port = 3000;

const search = require('./api/pageScraper');

app.use(express.json());
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // disabled for security on local
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});
// http://localhost:3000/manga?source=mangakatana-manganelo&keyword=grand_blue
app.get('/manga', (req, res) => {
	let source = req.query.source;
	let keyword = req.query.keyword;

	function formatSources(src) {
		return src.split('-');
	}

	function formatKeyword(keyword) {
		return keyword.replace(/_/g, ' ').toString();
	}

	let data = search.launchScraper(
		formatKeyword(keyword),
		formatSources(source)
	);

	res.header('Content-Type', 'application/json');
	res.json(data);
	res.status(500).json({ error: 'message' });
});

app.listen(port, () => {
	console.log(`API listening at http://localhost:${port}`);
});

//Test searches
// search.launchScraper('le');
// search.launchScraper('grand blue', ['mangakatana', 'manganelo']);

// search.launchScraper('legend');
// search.launchScraper(`Path of the Shaman`);

module.exports = app;
