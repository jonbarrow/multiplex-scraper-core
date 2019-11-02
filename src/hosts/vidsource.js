const got = require('got');

async function scrape(embedURL) {
	const id = embedURL.split('/v/').pop().split('/')[0];
	const {body} = await got.post(`https://vidsource.me/api/source/${id}`, {
		json: true
	});

	return body.data;
}

module.exports = {
	scrape
};