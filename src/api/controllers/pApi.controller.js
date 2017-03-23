import * as pApi from '../config/pApi'

export function getCategory (req, res, next) {
  const categoryId = req.params.categoryId;
  (async() => {
    const resCategory = await pApi.getCategory(categoryId)
    res.send(resCategory)
  })().catch(next)
}
