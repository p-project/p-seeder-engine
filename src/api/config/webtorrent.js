import WebTorrent from 'webtorrent'

const client = new WebTorrent()

console.log('[PeerId] ' + client.peerId)

const opts = {
  announce: ['http://localhost:8000/announce']
}

// Seed test torrent
let buffer = new Buffer('TestFileContent')
buffer.name = 'TestFileName'
client.seed(buffer, opts, (torrent) => {
  console.log('seeding test file' + torrent.infoHash + ' peerId=' + torrent.discovery.peerId)
})

// Catch exit
process.stdin.resume()
process.on('exit', function (code) {
  console.log('Process exit')
})

// Catch CTRL+C
process.on('SIGINT', function () {
  console.log('\nCTRL+C...')

  client.destroy(() => {
    console.log('Client Destroyed')
    process.exit(0)
  })
})

// Catch uncaught exception
process.on('uncaughtException', function (err) {
  console.dir(err, { depth: null })
  client.destroy(() => {
    console.log('Client Destroyed')
    process.exit(1)
  })
})

export default client
