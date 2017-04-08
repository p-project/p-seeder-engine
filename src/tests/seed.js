import request from 'supertest'
import test from 'ava'
import path from 'path'
import { setup } from '.'

test('POST seed without body', async t => {
  const app = setup()
  let res = await request(app).get('/seed')
  t.is(res.status, 404)
})

test('Seed nonexistent file', async t => {
  const app = setup()
  const res = await request(app)
    .post('/seed')
    .type('json')
    .send({
      path: '/NotFound/file/not/Exist',
      desc: 'desc',
      name: 'name',
      categories: '/categories/1'
    })
  t.is(res.status, 404)
  t.deepEqual(res.body, {
    message: 'File not found',
    status: 'error'
  })
})

test('Seed new file', async t => {
  const app = setup()
  const file = path.join(__dirname, '/fixtures/video3.avi')
  const res = await request(app)
    .post('/seed')
    .type('json')
    .send({
      path: file,
      desc: 'desc',
      name: 'name',
      categories: '/categories/1'
    })
  t.is(res.status, 200)
  t.deepEqual(res.body.torrentHashInfo, '30a9398b409c13399d54477766e5712f5022b7c8')
})

test('Seed duplicate file', async t => {
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
    .post('/seed')
    .type('json')
    .send({
      path: file,
      desc: 'desc',
      name: 'name',
      categories: '/categories/1'
    })

  t.is(res.status, 409)
  t.deepEqual(res.body, {
    message: 'Torrent already added',
    status: 'error'
  })
})
