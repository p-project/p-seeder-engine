'use strict';

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
    res.send(torrent.infoHash);
  });
});

web.delete('/delete/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash;
  bt.remove(infoHash, (err) => {
    res.send(err);
  });
});

// print the status of known torrents every now and then
timers.setInterval(() => {
  bt.torrents.forEach((t) => {
    console.log(t.infoHash + '\n' +
      '\tUp: ' + t.uploadSpeed + ' ' + t.uploaded + '\n' +
        '\tDown: ' + t.downloadSpeed + ' ' + t.downloaded
    );
  });
}, 1000);

web.listen(2342);
