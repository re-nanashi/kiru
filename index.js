const search = require('./api/pageScraper');

//Test searches
// search.launchScraper('le');
// search.launchScraper('grand blue', ['mangakatana', 'manganelo']);

// search.launchScraper('legend');
// search.launchScraper(`Path of the Shaman`);

module.exports = app;

// let source = req.query.source;
// let keyword = req.query.keyword;
// function formatSources(src) {
// 	return src.split('-');
// }
// function formatKeyword(keyword) {
// 	return keyword.replace(/_/g, ' ').toString();
// }
// let data = search.launchScraper(
// 	formatKeyword(keyword),
// 	formatSources(source)
// );
// res.header('Content-Type', 'application/json');
// res.send({ name: 'john' });
