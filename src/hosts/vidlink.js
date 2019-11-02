const got = require('got');
const unpacker = require('../unpacker');

const URL_API = 'https://vidlink.org/embed/update_views';
const regex = /file1="(.*?)";/;

async function scrape(embedURL) {
	const embedId = embedURL.split('/').pop();
	const response = await got.post(URL_API, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: `postID=${embedId}`
	});

	const unpacked = unpacker.unPack(response.body);
	const regexData = regex.exec(unpacked);

	if (!regexData || !regexData[1]) {
		return null;
	}

	return regexData[1];
}

module.exports = {
	scrape
};
