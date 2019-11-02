const { EventEmitter } = require('events');
const got = require('got');
const async = require('async');
const { JSDOM } = require('jsdom');
const embedScraper = require('../embed');

const URL_BASE = 'https://vidsrc.me';
const URL_EMBED = `${URL_BASE}/embed`;
const URL_SERVER = `${URL_BASE}/server`;
const URL_WATCHING = `${URL_BASE}/watching`;

class VidSrc extends EventEmitter {
	constructor() {
		super();
	}

	async scrape(traktDetails, type, season, episode) {
		let url;
		if (type === 'show') {
			url = `${URL_EMBED}/${traktDetails.ids.imdb}/${season}-${episode}/`;
		} else {
			url = `${URL_EMBED}/${traktDetails.ids.imdb}/`;
		}

		const response = await got(url, {
			throwHttpErrors: false
		});
		const body = response.body;

		const dom = new JSDOM(body);

		const serverIdList =  [...dom.window.document.querySelectorAll('.server')]
			.map(element => element.getAttribute('data'));

		async.each(serverIdList, (id, callback) => {
			got.head(`${URL_WATCHING}?i=${traktDetails.ids.imdb}&srv=${id}`, {
				headers: {
					referer: `${URL_SERVER}${id}/${traktDetails.ids.imdb}/`
				}
			}).then(({url}) => {
				embedScraper(url)
					.then(streams => {
						if (streams) {
							for (const stream of streams) {
								stream.aggregator = 'vidsrc';
								this.emit('stream', stream);
							}
						}

						callback();
					});
			});
		}, () => {
			this.emit('finished');
		});
	}
}

module.exports = VidSrc;