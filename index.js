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
//example www.api.com/manga/?source=mangakata-manganelo-asurascans&query=karakai_jouzu
app.get('/search', (req, res) => {
	let source = req.query.source.toLowerCase();
	let keyword = req.query.keyword.toLowerCase();

	function formatSources(src) {
		return src.split('-');
	}

	function formatKeyword(keyword) {
		return keyword.replace(/_/g, ' ');
	}

	search.launchScraper(formatKeyword(keyword), formatSources(source));
	const data = require('./data.json');

	res.header('Content-Type', 'application/json');
	res.send(data);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

//Test searches
// search.launchScraper('le');
// search.launchScraper('grand blue', ['mangakatana', 'manganelo']);

// search.launchScraper('legend');
// search.launchScraper(`Path of the Shaman`);

module.exports = app;
