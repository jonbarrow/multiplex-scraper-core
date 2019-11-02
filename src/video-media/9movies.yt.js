// DEAD. RECAPTCHA

const got = require('got');
const { EventEmitter } = require('events');
const { JSDOM } = require('jsdom');

const URL_BASE = 'https://9movies.yt';
const URL_AJAX = `${URL_BASE}/ajax`;
const URL_SUGGEST_SEARCH = `${URL_AJAX}/suggest_search`;
const URL_EPISODES = `${URL_AJAX}/movie_episodes`;
const URL_SOURCES = `${URL_AJAX}/movie_sources/`;

class NineMovies extends EventEmitter {
	constructor() {
		super();
	}

	async scrape({title}, type) {
		if (type !== 'movie') { // This site has TV shows! Need to figure out a good way to support them, since the search engine SUCKS
			return this.emit('finished');
		}

		let response = await got.post(URL_SUGGEST_SEARCH, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: `keyword=${title}`
		});

		const searchSuggestions = JSON.parse(response.body); // "got" throws an error if you use the "json" option with a non-json POST body
		let dom = new JSDOM(searchSuggestions.content);
		const result = [...dom.window.document.querySelectorAll('a.name')]
			.map(element => ({
				name: element.innerHTML,
				url: element.href
			}))
			.find(({name}) => name === title);

		let id = result.url.split('-').pop();
		if (id.endsWith('/')) {
			id = id.split('/')[0];
		}

		response = await got(`${URL_EPISODES}/${id}`, {
			json: true
		});
		dom = new JSDOM(response.body.html);

		const episodeId = dom.window.document.querySelector('.ep-item').dataset.id;

		response = await got.post(URL_SOURCES, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: `eid=${episodeId}`
		});

		const sources = JSON.parse(response.body);

		for (const playlist of sources.playlist) {
			for (const source of playlist.sources) {
				const stream = {
					aggregator: '9movies',
					file_host: '',
					file: source.file,
					quality: source.label,
					m3u8: (source.type === 'hls' || source.type === 'm3u8')
				};

				if (playlist.tracks) {
					stream.subtitles = [];

					for (const track of playlist.tracks) {
						stream.subtitles.push({
							file: track.file,
							language: track.label
						});
					}
				}

				this.emit('stream', stream);
			}
		}

		this.emit('finished');
	}
}

module.exports = NineMovies;