/**
* P-monitor client
*
**/
import rp from 'request-promise'
import TrackerClient from 'bittorrent-tracker'

const urlPMonitor = process.env.P_MONITOR_API_URL

export async function getSeedTorrent () {
  const res = await rp({method: 'POST', uri: urlPMonitor + 'getSeedTorrent'})
              .catch(() => { return null })
  return res ? res.hashInfo : null
}

export function notifySeeding () {
  return 'lol WIP'
}

export function scrape () {
  var requiredOpts = {
    infoHash: new Buffer('aaa67059ed6bd08362da625b3ae77f6f4a075aaa'),
    peerId: new Buffer('01234567890123456789'),
    announce: [process.env.ANNOUNCE_URL_UDP],
    port: 4561
  }
  var client = new TrackerClient(requiredOpts)

  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      reject('scrape timed out after 5s')
    }, 5000)
    client.on('warning', reject)
    client.on('error', reject)

    client.scrape()

    client.on('scrape', resolve)
  })
}
