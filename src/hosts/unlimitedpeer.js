const got = require('got');

const REGEX = /urlVideo = '(.*?)'/;

async function scrape(embedURL) {
	const {body} = await got(embedURL);

	const regexData = REGEX.exec(body);
	if (!regexData || !regexData[1]) {
		return null;
	}

	return regexData[1];
}

module.exports = {
	scrape
};