const got = require('got');

const GET_STREAM_REGEX = /file: '(.*?)'/;

async function scrape(embedURL) {
	const response = await got(embedURL);
	const body = response.body;

	const redirect = body.match(GET_STREAM_REGEX);
	
	if (!redirect || !redirect[1]) {
		return null;
	}

	const head = await got.head(redirect[1], {
		headers: {
			referer: embedURL
		}
	});

	return head.url;
}

module.exports = {
	scrape
};