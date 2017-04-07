import Config from '../config'
import http from '../http'
import WebTorrent from 'webtorrent'

export function setup () {
  const config = new Config({})
  const torrent = new WebTorrent()
  const web = http(config, torrent)
  web.listen(0) // random port
  return web
}
