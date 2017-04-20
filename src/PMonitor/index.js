/**
 * P-monitor client
 *
 **/
import rp from 'request-promise'
import TrackerClient from 'bittorrent-tracker'
import WebSocket from 'ws'

class PMonitor {
  constructor (config, client) {
    this.config = config
    this.ws = this.initWebsocket(config, client)
  }

  initWebsocket (config, client) {
    let ws = new WebSocket(config.pseeder.monitor.ws, {
      perMessageDeflate: false
    })
    const self = this
    ws.on('open', function () {
      self.register(client.peerId)
    })
    ws.on('close', function () {
      console.log('P-Monitor closed connection')
      process.exit()
    })
    return ws
  }

  async getSeedTorrent (config) {
    try {
      const res = await rp({method: 'POST', uri: config.pseeder.monitor.api + 'getSeedTorrent'})
      return res ? res.hashInfo : undefined
    } catch (e) {
      return undefined
    }
  }

  register (peerId) {
    this.sendJson({endpoint: 'register', peerId})
  }

  notifySeeding (hashInfo) {
    this.sendJson({endpoint: 'seeding', hashInfo})
  }

  sendJson (object) {
    this.ws.send(JSON.stringify(object))
  }

  scrape (config) {
    var requiredOpts = {
      infoHash: new Buffer('aaa67059ed6bd08362da625b3ae77f6f4a075aaa'),
      peerId: new Buffer('01234567890123456789'),
      announce: [`udp://${config.pseeeder.monitor.announce}`],
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
}

export default PMonitor
