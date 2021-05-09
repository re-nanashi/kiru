const express = require('express');
const app = express();
const port = 3000;

const search = require('./api/pageScraper');

// app.use(express.json());
// app.use(function (req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*'); // disabled for security on local
// 	res.header('Access-Control-Allow-Headers', 'Content-Type');
// 	next();
// });

// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });

// app.listen(port, () => {
// 	console.log(`Example app listening at http://localhost:${port}`);
// });

//Test searches
// search.launchScraper('le');
// search.launchScraper('gin no saji');
search.launchScraper('karakai jouzu', ['mangakatana', 'manganelo']);
// search.launchScraper('legend');
// search.launchScraper(`Path of the Shaman`);
