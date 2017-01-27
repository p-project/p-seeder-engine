/**
 * P-monitor client
 *
 **/
import rp from 'request-promise'

const urlPMonitor = 'http://localhost:3000/api/'

export async function getSeedTorrent () {
  const res = await rp({method: 'POST', uri: urlPMonitor + 'getSeedTorrent'})
                .catch(() => { return null })
  return res ? res.hashInfo : null
}

export function notifySeeding () {
  return 'lol WIP'
}
