import request from 'supertest'
import test from 'ava'
import path from 'path'
import { setup } from '.'

test('Add invalid infohash', async t => {
  const app = setup()
  const res = await request(app)
    .post('/add')
    .type('json')
    .send({ infoHash: '1234' })
  t.is(res.status, 400)
  t.deepEqual(res.body, {
    message: 'Can\'t parse infoHash',
    status: 'error'
  })
})

test('Add already present infohash', async t => {
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
    .post('/add/30a9398b409c13399d54477766e5712f5022b7c8')
  t.is(res.status, 409)
  t.deepEqual(res.body, {
    message: 'Torrent already added',
    status: 'error'
  })
})

test('Add already present infohash through body', async t => {
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
    .post('/add')
    .type('json')
    .send({ infoHash: '30a9398b409c13399d54477766e5712f5022b7c8' })
  t.is(res.status, 409)
  t.deepEqual(res.body, {
    message: 'Torrent already added',
    status: 'error'
  })
})

test('POST add without body', async t => {
  const app = setup()
  const res = await request(app)
    .post('/add')
    .type('json')
  t.is(res.status, 400)
})
