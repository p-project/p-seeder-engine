import Config from '../config'
import http from '../http'
import PMonitor from '../PMonitor'
import WebTorrent from 'webtorrent'

export function setup () {
  const config = new Config({})
  const torrent = new WebTorrent()
  const pMonitor = new PMonitor(config, torrent)
  const web = http(config, torrent, pMonitor)
  web.listen(0) // random port
  return web
}
