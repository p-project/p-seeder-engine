import chai, { expect } from 'chai'
import request from 'supertest-as-promised'
import path from 'path'

import app from '../'

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
        .expect(400)
        done()
      })()
    })

    it('Should return infoHash', function (done) {
      this.timeout(20000);
      (async() => {
        await request(app)
        .post('/seedNewVideo')
        .type('form')
        .send({videoPath: path.join(__dirname, '/torrent.test.js')})
        .expect(200)

        done()
      })()
    })
  })
})
