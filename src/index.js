import WebTorrent from 'webtorrent';
import timers from 'timers';
import express from 'express';

const web = express();
const bt = new WebTorrent();

web.get('/list', (req, res) => {
  let torrentHashes = bt.torrents.map((t) => t.infoHash);
  res.json(torrentHashes);
});

web.post('/add/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash;
  bt.add(infoHash, (torrent) => {
    console.log('added ' + infoHash);
    res.send(torrent.infoHash);
  });
});

web.delete('/delete/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash;
  bt.remove(infoHash, (err) => {
    console.log('removed ' + infoHash);
    res.send(err);
  });
});

web.get('/info/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash;
  let torrent = bt.get(infoHash);
  res.json({
    infoHash: torrent.infoHash,
    timeRemaining: torrent.timeRemaining,
    received: torrent.received,
    downloaded: torrent.downloaded,
    uploaded: torrent.uploaded,
    downloadSpeed: torrent.downloadSpeed,
    uploadSpeed: torrent.uploadSpeed,
    progress: torrent.progress,
    ratio: torrent.ratio,
    numPeers: torrent.numPeers,
    path: torrent.path
  });
});

web.listen(2342);
