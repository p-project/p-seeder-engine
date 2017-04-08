import * as pApi from '../../PAPI'

export async function getCategory (req, res, config) {
  const result = await pApi.request('GET', 'categories', req.query, config)
  res.send(result)
}

export async function getVideo (req, res, config) {
  const result = await pApi.request('GET', 'videos', req.query, config)
  res.send(result)
}
