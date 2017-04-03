import WebTorrent from 'webtorrent'

const client = new WebTorrent()

client.on('error', function (err) {
  console.log('[WebtorrentClient] ' + err)
})

console.log('[WebtorrentClient] PeerId: ' + client.peerId)

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
