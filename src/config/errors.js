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

export const ERR_INFOHASH_PARSE = {
  id: 30,
  msg: 'Can\'t parse infoHash',
  httpCode: 400
}

export const ERR_TORRENT_ALREADY_ADDED = {
  id: 40,
  msg: 'Torrent already added',
  httpCode: 400
}

export const ERR_INFOHASH_NOT_FOUND = {
  id: 50,
  msg: 'Torrent not found',
  httpCode: 400
}

export function sendError (res, error) {
  res.status(error.httpCode)
  res.send(getResBody(error))
}

export function getResBody (error) {
  return {status: 'error', id: error.id, message: error.msg}
}

export function sendUnexpectedError (res, error) {
  res.send(error)
}
