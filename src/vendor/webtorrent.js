import WebTorrent from 'webtorrent'

const client = new WebTorrent()

client.on('error', function (err) {
  console.error('[WebtorrentClient] ' + err)
})

// Catch exit
process.stdin.resume()
process.on('exit', function (code) {
  console.error('Process exit')
})

// Catch CTRL+C
process.on('SIGINT', function () {
  console.error('\nCTRL+C...')

  client.destroy(() => {
    console.error('Client Destroyed')
    process.exit(0)
  })
})

// Catch uncaught exception
process.on('uncaughtException', function (err) {
  console.dir(err, { depth: null })
  client.destroy(() => {
    console.error('Client Destroyed')
    process.exit(1)
  })
})

export default client
