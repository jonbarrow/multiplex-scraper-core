const got = require('got');

const REGEX = /unescape\('(http.+?)'/;

async function scrape(embedURL, referer) {
	const response = await got(embedURL, {
		throwHttpErrors: false,
		headers: {
			Referer: referer
		}
	});
	const body = response.body;

	const EMBED_DATA = REGEX.exec(body);
	
	if (!EMBED_DATA || !EMBED_DATA[1]) {
		return null;
	}

	const stream = EMBED_DATA[1];

	return decodeURIComponent(stream);
}

module.exports = {
	scrape
};