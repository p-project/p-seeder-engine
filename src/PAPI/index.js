/**
* P-Api client
*
**/
import rp from 'request-promise'

export function createVideo (torrent, videoInfos, config) {
  const metadata = {
    height: 0,
    width: torrent.files[0].length,
    format: 'kekFormat'
  }

  const video = {
    title: videoInfos.name,
    description: videoInfos.desc,
    uploadDate: '2017-02-09T18:21:04.914Z',
    metadata: metadata,
    categories: videoInfos.categories,
    hash: torrent.infoHash,
    magnet: torrent.magnetURI
  }

  return rp({
    method: 'POST',
    uri: `http://${config.pseeder.papi}` + 'videos',
    body: video,
    json: true
  })
}

export function request (method, endpoint, body, config) {
  return rp({
    method,
    uri: `http://${config.pseeder.papi}` + endpoint,
    body,
    qs: body,
    json: true
  })
}
