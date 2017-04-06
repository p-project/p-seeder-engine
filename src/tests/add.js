import request from 'supertest'
import test from 'ava'
import { setup } from '.'

test('Add invalid infohash', async t => {
  const app = setup()
  const res = await request(app)
    .post('/add')
    .type('json')
    .send({ infoHash: '1234'})
  t.is(res.status, 400)
  t.deepEqual(res.body,{
    message: 'Can\'t parse infoHash',
    status: 'error'
  })
})
