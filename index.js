import WebTorrent from 'webtorrent-hybrid';

const client = new WebTorrent();
const file = 'index.js';
client.seed(file, function (torrent) {
  console.log('started seeding %s - %s', torrent.infoHash, torrent.files[0].name);
});
