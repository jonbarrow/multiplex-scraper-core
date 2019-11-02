process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const async = require('async'); // asynchronous utils
const { EventEmitter } = require('events');

const scrapers = require('./scrapers'); // all scapers
const trakt = require('../trakt'); // util functions

class VideoMediaScraper extends EventEmitter {
	constructor() {
		super();
	}

	async scrape(id, season, episode) {
		let details;
		let type;

		if (season && episode) {
			details = await trakt.showDetails(id);
			type = 'show';
		} else {
			details = await trakt.movieDetails(id);
			type = 'movie';
		}

		async.each(scrapers, (Scraper, callback) => {
			const scraper = new Scraper();

			scraper.on('stream', stream => {
				this.emit('stream', stream);
			});

			scraper.on('finished', callback);

			scraper.scrape(details, type, season, episode);
		}, () => {
			this.emit('finished');
		});
	}
}

module.exports = VideoMediaScraper;