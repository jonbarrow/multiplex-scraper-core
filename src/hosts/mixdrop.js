// This is host requires that the stream be requested with the "referer" header set to the embed URL
// That basically makes this host useless to me

const got = require('got');
const unpacker = require('../unpacker');

const packedRegex = /(eval\(function\(p,a,c,k,e,d\){.*?}\(.*?\.split\('\|'\),\d*,{}\)\))/;
const sourceRegex = /MDCore.vsrc="(.*?)";/;

async function scrape(embedURL) {
	embedURL = embedURL.replace('/f/', '/e/');
	const response = await got(embedURL);
	const body = response.body;

	const packed = packedRegex.exec(body)[1];
	const unpacked = unpacker.unPack(packed);

	const source = sourceRegex.exec(unpacked);
	
	return source[1];
}

module.exports = {
	scrape
};