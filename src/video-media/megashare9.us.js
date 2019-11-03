const got = require('got');
const { EventEmitter } = require('events');
const { JSDOM } = require('jsdom');
const url = require('url');
const async = require('async');
const embedScraper = require('../embed');

class MegaShare9 extends EventEmitter {
	constructor() {
		super();
	}

	async scrape({ids: {slug}}) {
		const response = await got(`http://megashare9.us/putlockers/watch-online-${slug}-free-download/`);
		const dom = new JSDOM(response.body);

		const embedList = [...dom.window.document.querySelectorAll('a[rel=nofollow]')]
			.map(element => (url.parse(element.href, true).query).id)
			.filter(id => id !== '')
			.map(encoded => Buffer.from(encoded, 'base64').toString())
			.filter(embed => !(embed.includes('clipwatching'))); // Ignore clipwatching embed host, it's slow

		async.each(embedList, (embed, callback) => {
			embedScraper(embed)
				.then(streams => {
					if (streams) {
						for (const stream of streams) {
							stream.aggregator = 'megashare9';
							this.emit('stream', stream);
						}
					}

					callback();
				});
		}, () => {
			this.emit('finished');
		});
	}
}

module.exports = MegaShare9;

/*
(async () => {
	const scraper = new MegaShare9();
	const streams = [];

	scraper.on('stream', stream => {
		streams.push(stream);
	});

	scraper.on('finished', () => {
		console.timeEnd('scraping');
		console.log(`Streams: ${streams.length}`);
		console.log(streams);
	});
	
	console.time('scraping');
	scraper.scrape({
		ids: {
			slug: 'zombieland-double-tap-2019'
		}
	}, 'movie');
})();
*/