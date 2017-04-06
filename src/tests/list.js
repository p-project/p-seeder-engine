import request from 'supertest'
import test from 'ava'
import app from '../vendor/express'

test('GET empty list', async t => {
  app.listen(0) // random port
  let res = await request(app).get('/list')
  t.is(res.status, 200)
  t.deepEqual(res.body, [])
})
