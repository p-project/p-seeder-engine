import request from 'supertest'
import test from 'ava'
import app from '../vendor/express'

test('Add BBB magnet link', async t => {
  app.listen(0) // random port
  let res = await request(app)
    .post('/add')
    .type('json')
    .send({ infoHash: 'magnet:?xt=urn:btih:565DB305A27FFB321FCC7B064AFD7BD73AEDDA2B&dn=bbb_sunflower_1080p_60fps_normal.mp4&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net%2fvideo%2fmp4%2fbbb_sunflower_1080p_60fps_normal.mp4'})
  t.is(res.text, '565db305a27ffb321fcc7b064afd7bd73aedda2b')
})

test('Add invalid infohash', async t => {
  app.listen(0) // random port
  let res = await request(app)
    .post('/add')
    .type('json')
    .send({ infoHash: '1234'})
  t.is(res.status, 400)
  t.deepEqual(res.body,{
    message: 'Can\'t parse infoHash',
    status: 'error'
  })
})
