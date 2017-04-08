#!/usr/bin/env node

import program from 'commander'
import Config from './config'
import http from './http'
import WebTorrent from 'webtorrent-hybrid'

program
  .option('-p --port <port>', 'Specify the port the daemon will listen on for commands.')
  .option('-o --out <path>', 'Specify the path where downloaded files will be written.')
  .parse(process.argv)

const config = new Config(program)
const torrent = new WebTorrent()
const web = http(config, torrent)

console.error(`listening on port ${config.pseeder.port}`)
web.listen(config.pseeder.port)
