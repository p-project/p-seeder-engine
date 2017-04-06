import request from 'supertest'
import test from 'ava'
import { setup } from '.'

test('GET empty list', async t => {
  const app = setup()
  const res = await request(app).get('/list')
  t.is(res.status, 200)
  t.deepEqual(res.body, [])
})
