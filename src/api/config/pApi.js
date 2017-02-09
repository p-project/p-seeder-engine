/**
* P-Api client
*
**/
import rp from 'request-promise'

const urlPApi = process.env.P_API_URL

export async function createVideo (torrent) {
  const metadata = {
    height: 0,
    width: torrent.files[0].length,
    format: 'kekFormat',
    hash: torrent.magnetURI
  }

  const video = {
    title: torrent.files[0].name,
    description: 'string',
    uploadDate: '2017-02-09T18:21:04.914Z',
    metadata: metadata
  }

  const resVideo = await rp({
    method: 'POST',
    uri: urlPApi + 'videos',
    body: video,
    json: true
  })

  console.log(resVideo)
}
