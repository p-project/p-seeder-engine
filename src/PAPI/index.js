/**
* P-Api client
*
**/
import rp from 'request-promise'

export async function createVideo (torrent, videoInfos, config) {
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

  const resVideo = await rp({
    method: 'POST',
    uri: `http://${config.pseeder.monitor.api}` + 'videos',
    body: video,
    json: true
  })

  return resVideo
}

export async function getCategory (categoryId, config) {
  const resCategory = await rp({
    method: 'GET',
    uri: `http://${config.pseeder.monitor.api}` + 'categories/' + categoryId,
    json: true
  })

  return resCategory
}

export function request (method, endpoint, body, config) {
  return rp({
    method,
    uri: `http://${config.pseeder.monitor.api}` + endpoint,
    body,
    json: true
  })
}
