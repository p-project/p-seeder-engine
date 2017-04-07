import request from 'supertest'
import test from 'ava'
import path from 'path'
import { setup } from '.'

test('Info about invalid infohash', async t => {
  const app = setup()
  const res = await request(app)
    .get('/info/1234')
  t.is(res.status, 400)
  t.deepEqual(res.body, {
    message: 'Can\'t parse infoHash',
    status: 'error'
  })
})

test('Info about unknown infohash', async t => {
  const app = setup()
  const res = await request(app)
    .get('/info/30a9398b409c13399d54477766e5712f5022b7c8')
  t.is(res.status, 404)
  t.deepEqual(res.body, {
    message: 'Torrent not found',
    status: 'error'
  })
})

test('Info about valid infohash', async t => {
  const app = setup()
  const file = path.join(__dirname, '/fixtures/video3.avi')
  await request(app)
    .post('/seed')
    .type('json')
    .send({
      path: file,
      desc: 'desc',
      name: 'name',
      categories: '/categories/1'
    })
  const res = await request(app)
    .get('/info/30a9398b409c13399d54477766e5712f5022b7c8')
  t.is(res.status, 200)
  t.is(res.body.name, 'name.avi')
  t.is(res.body.infoHash, '30a9398b409c13399d54477766e5712f5022b7c8')
  t.is(res.body.downloaded, 7)
  t.is(res.body.length, 7)
})
