import chai, { expect } from 'chai'
import request from 'supertest-as-promised'
import path from 'path'

import app from '../'
import * as Errors from '../config/errors'
import client from '../config/webtorrent'

async function seedNewVideo (videoPath) {
  return await request(app)
    .post('/seedNewVideo')
    .type('form')
    .send({videoPath})
}

describe('## Torrent APIs', () => {
  describe('# POST seedNewVideo', () => {
    it('Should return bad request', (done) => {
      (async() => {
        await request(app)
        .post('/seedNewVideo')
        .type('form')
        .send(null)
        .expect(400)

        done()
      })()
    })

    it('Should return file not found', (done) => {
      (async() => {
        await request(app)
        .post('/seedNewVideo')
        .type('form')
        .send({videoPath: '/NotFound/file/not/Exist'})
        .expect(Errors.ERR_SEED_FILE_NOT_FOUND.httpCode)
        .expect(Errors.getResBody(Errors.ERR_SEED_FILE_NOT_FOUND))
        done()
      })()
    })

    it('Should return infoHash', function (done) {
      this.timeout(20000);
      (async() => {
        const res = await seedNewVideo(path.join(__dirname, '/fixtures/video3.avi'))
        expect(res.body.torrentHashInfo).to.exist
        done()
      })()
    })

    it('Should return duplicate error', function (done) {
      this.timeout(20000);
      (async() => {
        const res = await seedNewVideo(path.join(__dirname, '/fixtures/video3.avi'))
        expect(res.body).to.be.eql(Errors.getResBody(Errors.ERR_TORRENT_ALREADY_ADDED))

        done()
      })()
    })
  })

  describe('# POST seed', () => {
    it('Should return error monitor', (done) => {
      (async() => {
        await request(app)
        .post('/seed')
        .type('form')
        .send(null)
        .expect(Errors.ERR_INFOHASH_MONITOR.httpCode)
        .expect(Errors.getResBody(Errors.ERR_INFOHASH_MONITOR))

        done()
      })()
    })
  })

  describe('# GET list', () => {
    it('Should list hashInfo', (done) => {
      (async() => {
        let res = await request(app)
        .get('/list')
        .type('form')
        .send(null)
        .expect(200)

        expect(res.body).to.be.instanceof(Array)

        done()
      })()
    })
  })

  describe('# POST add', () => {
    it('Should return error parse infohash', (done) => {
      (async() => {
        await request(app)
        .post('/add/1234')
        .type('form')
        .send(null)
        .expect(Errors.ERR_INFOHASH_PARSE.httpCode)
        .expect(Errors.getResBody(Errors.ERR_INFOHASH_PARSE))

        done()
      })()
    })

    it('Should return duplicate error', function (done) {
      (async() => {
        this.timeout(20000)
        const res = await seedNewVideo(path.join(__dirname, '/fixtures/video1.avi'))

        await request(app)
          .post('/add/' + res.body.torrentHashInfo)
          .type('form')
          .send(null)
          .expect(Errors.ERR_TORRENT_ALREADY_ADDED.httpCode)
          .expect(Errors.getResBody(Errors.ERR_TORRENT_ALREADY_ADDED))

        done()
      })()
    })
  })

  describe('# DELETE delete', () => {
    it('Should return error parse infohash', (done) => {
      (async() => {
        await request(app)
        .delete('/delete/1234')
        .type('form')
        .send(null)
        .expect(Errors.ERR_INFOHASH_PARSE.httpCode)
        .expect(Errors.getResBody(Errors.ERR_INFOHASH_PARSE))

        done()
      })()
    })
    it('Should return error torrent not found', (done) => {
      (async() => {
        await request(app)
        .delete('/delete/b7d5c3a66218c1f334d8c6467a589e864c7716b1')
        .type('form')
        .send(null)
        .expect(Errors.ERR_INFOHASH_NOT_FOUND.httpCode)
        .expect(Errors.getResBody(Errors.ERR_INFOHASH_NOT_FOUND))

        done()
      })()
    })

    it('Should remove torrent', function (done) {
      (async() => {
        this.timeout(20000)
        const res = await seedNewVideo(path.join(__dirname, '/fixtures/video2.avi'))
        const infoHash = res.body.torrentHashInfo

        const oldTorrentLength = client.torrents.length

        await request(app)
        .delete('/delete/' + infoHash)
        .type('form')
        .send(null)
        .expect(200)

        expect(oldTorrentLength).to.be.equal(client.torrents.length + 1)

        done()
      })()
    })
  })
})
