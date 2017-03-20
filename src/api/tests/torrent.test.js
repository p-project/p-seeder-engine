import {} from '../../'

import request from 'supertest'
import path from 'path'
import { expect } from 'chai'

import app from '../'
import * as Errors from '../config/errors'
import client from '../config/webtorrent'

function seed (path) {
  var params = {
    path,
    desc: 'desc',
    name: 'name',
    categories: '/categories/1'
  }
  return request(app)
    .post('/seed')
    .type('json')
    .send(params)
}

describe('## Torrent APIs', () => {
  describe('# POST seed', () => {
    it('Should return bad request', () =>
      request(app).post('/seed').expect(400)
    )

    it('Should return file not found', async () => {
      const res = await seed('/NotFound/file/not/Exist')
      expect(res.body).to.be.eql(Errors.getResBody(Errors.ERR_SEED_FILE_NOT_FOUND))
      expect(res.statusCode).to.be.equal(Errors.ERR_SEED_FILE_NOT_FOUND.httpCode)
    })

    it('Should return infoHash', async () => {
      const res = await seed(path.join(__dirname, '/fixtures/video3.avi'))
      return expect(res.body).to.have.property('torrentHashInfo')
    }).timeout(20000)

    it('Should return duplicate error', async() => {
      const res = await seed(path.join(__dirname, '/fixtures/video3.avi'))
      return expect(res.body).to.be.eql(Errors.getResBody(Errors.ERR_TORRENT_ALREADY_ADDED))
    }).timeout(20000)
  })

  describe('# PUT seedMonitored', () => {
    it('Should return error monitor', () => {
      return request(app)
        .put('/seedMonitored')
        .expect(Errors.ERR_INFOHASH_MONITOR.httpCode)
        .expect(Errors.getResBody(Errors.ERR_INFOHASH_MONITOR))
    })
  })

  describe('# GET list', () => {
    it('Should list hashInfo', async () => {
      let res = await request(app)
        .get('/list')
        .expect(200)

      expect(res.body).to.be.instanceof(Array)
    })
  })

  describe('# POST add', () => {
    it('Should return error parse infohash', () =>
      request(app)
      .post('/add/1234')
      .expect(Errors.ERR_INFOHASH_PARSE.httpCode)
      .expect(Errors.getResBody(Errors.ERR_INFOHASH_PARSE))
    )

    it('Should return duplicate error', async() => {
      const res = await seed(path.join(__dirname, '/fixtures/video1.avi'))
      return request(app)
        .post('/add/' + res.body.torrentHashInfo)
        .expect(Errors.ERR_TORRENT_ALREADY_ADDED.httpCode)
        .expect(Errors.getResBody(Errors.ERR_TORRENT_ALREADY_ADDED))
    }).timeout(20000)
  })

  describe('# POST add with json body', () => {
    it('Should return error parse infohash', () =>
      request(app)
      .post('/add')
      .type('json')
      .send({infoHash: '1234'})
      .expect(Errors.ERR_INFOHASH_PARSE.httpCode)
      .expect(Errors.getResBody(Errors.ERR_INFOHASH_PARSE))
    )

    it('Should return duplicate error', async() => {
      const res = await seed(path.join(__dirname, '/fixtures/video2.avi'))
      return request(app)
        .post('/add')
        .type('json')
        .send({infoHash: res.body.torrentHashInfo})
        .expect(Errors.ERR_TORRENT_ALREADY_ADDED.httpCode)
        .expect(Errors.getResBody(Errors.ERR_TORRENT_ALREADY_ADDED))
    }).timeout(20000)
  })

  describe('# DELETE delete', () => {
    it('Should return error parse infohash', async() =>
      request(app)
      .delete('/delete/1234')
      .expect(Errors.ERR_INFOHASH_PARSE.httpCode)
      .expect(Errors.getResBody(Errors.ERR_INFOHASH_PARSE))
    )

    it('Should return error torrent not found', async() =>
      await request(app)
      .delete('/delete/b7d5c3a66218c1f334d8c6467a589e864c7716b1')
      .expect(Errors.ERR_INFOHASH_NOT_FOUND.httpCode)
      .expect(Errors.getResBody(Errors.ERR_INFOHASH_NOT_FOUND))
    )
  })

  it('Should remove torrent', async() => {
    const res = await seed(path.join(__dirname, '/fixtures/video2.avi'))
    const infoHash = res.body.torrentHashInfo

    const oldTorrentLength = client.torrents.length

    await request(app)
      .delete('/delete/' + infoHash)
      .expect(200)

    return expect(oldTorrentLength).to.be.equal(client.torrents.length + 1)
  }).timeout(20000)
})

describe('# GET info', () => {
  it('Should return error parse infohash', async() =>
    request(app)
    .get('/info/1234')
    .expect(Errors.ERR_INFOHASH_PARSE.httpCode)
    .expect(Errors.getResBody(Errors.ERR_INFOHASH_PARSE))
  )
  it('Should return error torrent not found', async() =>
    request(app)
    .get('/info/b7d5c3a66218c1f334d8c6467a589e864c7716b1')
    .expect(Errors.ERR_INFOHASH_NOT_FOUND.httpCode)
    .expect(Errors.getResBody(Errors.ERR_INFOHASH_NOT_FOUND))
  )

  it('Should return success info', async() => {
    const res = await seed(path.join(__dirname, '/fixtures/video4.avi'))
    const infoHash = res.body.torrentHashInfo

    const resInfo = await request(app).get('/info/' + infoHash)

    expect(resInfo.body).to.exist
    expect(resInfo.body.name).to.exist
    expect(resInfo.body.infoHash).to.exist
    expect(resInfo.body.timeRemaining).to.exist
    expect(resInfo.body.received).to.exist
    expect(resInfo.body.downloaded).to.exist
    expect(resInfo.body.uploaded).to.exist
    expect(resInfo.body.downloadSpeed).to.exist
    expect(resInfo.body.uploadSpeed).to.exist
    expect(resInfo.body.progress).to.exist
    expect(resInfo.body.length).to.exist
    expect(resInfo.body.ratio).to.exist
    expect(resInfo.body.numPeers).to.exist
    expect(resInfo.body.path).to.exist
  }).timeout(20000)
})
