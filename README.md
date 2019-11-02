## Multiplex Scraper Core

This repo contains the core module used for scraping streams used by Multiplex (formerly known as Stream Box)

### Example usage

```js
const { VideoMediaScraper } = require('multiplex-scraper-core');

(async () => {
	const streams = [];
	const scraper = new VideoMediaScraper();

	scraper.on('stream', stream => {
		streams.push(stream);
		console.log(stream);
	});

	scraper.on('finished', () => {
		console.timeEnd('Scrape Time');
		console.log(`Total streams: ${streams.length}`);
		console.log(streams);
	});
	
	console.log('Starting Sprited Away scraping');
	console.time('Scrape Time');
	scraper.scrape('tt0245429');
})();
```

### Sites
- [ ] 104196 (planned)
- [x] 124movies.to
- [x] consistent.stream
- [x] f2movies.to
- [ ] fmovies.to (planned)
- [X] gomostream.com
- [ ] gomovies.tube (planned)
- [ ] hdonline.eu (planned)
- [X] moviesjoy.net
- [ ] primewire.li (scraper broken, looking into fix)
- [X] putlockertv.biz
- [X] qazwsxedcrfvtgb.info
- [X] vidsrc.me
- [X] watchseries.to

### Embed Hosts
- [X] clipwatching
- [X] fembed
- [X] flix555
- [X] gounlimited
- [X] idtbox
- [X] megaxfer
- [X] mp4upload
- [X] onlystream
- [X] openload (DEAD HOST)
- [X] prettyfast
- [X] rapidvideo (DEAD HOST)
- [X] streamango (DEAD HOST)
- [X] trollvid
- [X] unlimitedpeer
- [X] verystream (DEAD HOST)
- [X] vev
- [X] vidlox
- [X] vidoza
- [X] vidsource
- [X] vidstreaming
- [X] viduplayer
- [X] vshare
- [X] xstreamcdn
- [X] yourupload