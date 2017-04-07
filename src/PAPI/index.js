/**
* P-Api client
*
**/
import rp from 'request-promise'

export function createVideo (torrent, videoInfos, config) {
  const metadata = {
    height: 0,
    width: torrent.files[0].length,
    format: 'kekFormat',
    hash: torrent.magnetURI
  }

  const video = {
    title: videoInfos.name,
    description: videoInfos.desc,
    uploadDate: '2017-02-09T18:21:04.914Z',
    metadata: metadata,
    categories: videoInfos.categories
  }

  return rp({
    method: 'POST',
    uri: `http://${config.pseeder.monitor.api}` + 'videos',
    body: video,
    json: true
  })
}

export function getCategory (categoryId, config) {
  return rp({
    method: 'GET',
    uri: `http://${config.pseeder.monitor.api}` + 'categories/' + categoryId,
    json: true
  })
}

export function request (method, endpoint, body, config) {
  return rp({
    method,
    uri: `http://${config.pseeder.monitor.api}` + endpoint,
    body,
    json: true
  })
}
