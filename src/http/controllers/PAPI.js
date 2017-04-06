import * as pApi from '../../PAPI'

export async function getCategory (req, res, config) {
  const categoryId = req.params.categoryId
  const resCategory = await pApi.getCategory(categoryId, config)
  res.send(resCategory)
}

export async function getVideo (req, res, config) {
  const result = await pApi.request('GET', 'videos', req.body, config)
  res.send(result)
}
