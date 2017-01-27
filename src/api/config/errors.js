export const ERR_SEED_FILE_NOT_FOUND = {
  id: 10,
  msg: 'File not found',
  httpCode: 400
}

export const ERR_INFOHASH_MONITOR = {
  id: 20,
  msg: 'Can\'t get the infoHash to seed via P-Monitor',
  httpCode: 400
}

export function sendError (res, error) {
  res.status(error.httpCode)
  res.send({status: 'error', id: error.id, message: error.msg})
}
