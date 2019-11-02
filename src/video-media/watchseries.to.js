const { EventEmitter } = require('events');
const got = require('got');
const { JSDOM } = require('jsdom');
const async = require('async');
const embedScraper = require('../embed');

const URL_BASE = 'http://dwatchseries.to/episode';

class WatchSeries extends EventEmitter {
	constructor() {
		super();
	}

	async scrape(traktDetails, type, season, episode) {
		if (type !== 'show') {
			return this.emit('finished');
		}

		const url = `${URL_BASE}/${traktDetails.ids.slug.replace(/-/g, '_')}_s${season}_e${episode}.html`;

		const {body} = await got(url, {throwHttpErrors: false});

		const dom = new JSDOM(body);

		const embedList =  [...dom.window.document.querySelectorAll('.watchlink')]
			.map(element => {
				return Buffer.from(element.href.split('r=')[1], 'base64').toString();
			});

		async.each(embedList, (embed, callback) => {
			embedScraper(embed)
				.then(streams => {
					if (streams) {
						for (const stream of streams) {
							stream.aggregator = 'watchseries';
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

module.exports = WatchSeries;