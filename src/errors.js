export const ERR_SEED_FILE_NOT_FOUND = {
  msg: 'File not found',
  httpCode: 404
}

export const ERR_INFOHASH_MONITOR = {
  msg: 'Can\'t get the infoHash to seed via P-Monitor',
  httpCode: 400
}

export const ERR_INFOHASH_PARSE = {
  msg: 'Can\'t parse infoHash',
  httpCode: 400
}

export const ERR_TORRENT_ALREADY_ADDED = {
  msg: 'Torrent already added',
  httpCode: 409
}

export const ERR_INFOHASH_NOT_FOUND = {
  msg: 'Torrent not found',
  httpCode: 404
}

export function sendError (res, error) {
  res.status(error.httpCode)
  res.send(getResBody(error))
}

export function getResBody (error) {
  return {status: 'error', message: error.msg}
}

export function sendUnexpectedError (res, error) {
  res.send(error)
}
