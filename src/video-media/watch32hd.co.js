const got = require('got');
const { EventEmitter } = require('events');
const { JSDOM } = require('jsdom');
const embedScraper = require('../embed');

const URL_BASE = 'https://watch32hd.co';
const URL_SEARCH = `${URL_BASE}/results`;

const iframeRegex = /var frame_url = "\/?\/?(.*?)"/;

class Watch32HD extends EventEmitter {
	constructor() {
		super();
	}

	async scrape({title}) {
		let response = await got(`${URL_SEARCH}?q=${title}`);
		const dom = new JSDOM(response.body);
		const result = [...dom.window.document.querySelectorAll('div.video_title h3 a')]
			.map(element => ({
				name: element.innerHTML,
				url: `${URL_BASE}/${element.href}`
			}))
			.find(({name}) => name.toLowerCase() === title.toLowerCase());

		response = await got(result.url);

		const iframeData = iframeRegex.exec(response.body);

		if (!iframeData || !iframeData[1]) {
			return this.emit('finished');
		}

		const iframeSrc = iframeData[1];
		
		const streams = await embedScraper(iframeSrc);

		if (streams) {
			for (const stream of streams) {
				stream.aggregator = 'watch32hd';
				this.emit('stream', stream);
			}
		}

		this.emit('finished');
	}
}

module.exports = Watch32HD;