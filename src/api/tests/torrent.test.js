import chai, { expect } from 'chai'
import request from 'supertest-as-promised'
import path from 'path'

import app from '../'
import * as Errors from '../config/errors'

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

    it('Should return bad request', (done) => {
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
        const res = await request(app)
        .post('/seedNewVideo')
        .type('form')
        .send({videoPath: path.join(__dirname, '/torrent.test.js')})
        .expect(200)

        expect(res.body.torrentHashInfo).to.exist
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
})
