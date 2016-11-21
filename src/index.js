import WebTorrent from 'webtorrent-hybrid';

let torrents = [];
const client = new WebTorrent();

console.log('hey');

const buffer = new Buffer('MDR');
client.seed(buffer, function (torrent) {
  torrents.push(torrent);
});

(async() => {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    for (let i = 0; i < torrents.length; i++) {
      console.log(torrents[i].infoHash + ' ' + torrents[i].magnetURI + ' ' + torrents[i].uploadSpeed + ' ' + torrents[i].uploaded);
    }
  }
})();
