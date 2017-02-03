/**
* P-monitor client
*
**/
import rp from 'request-promise'

const urlPMonitor = process.env.P_MONITOR_API_URL

export async function getSeedTorrent () {
  const res = await rp({method: 'POST', uri: urlPMonitor + 'getSeedTorrent'})
              .catch(() => { return null })
  return res ? res.hashInfo : null
}

export function notifySeeding () {
  return 'lol WIP'
}
