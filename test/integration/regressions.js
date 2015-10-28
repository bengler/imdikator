import {assert} from 'chai'
import {request} from '../../lib/http/request'
import {API_URL} from './config'

describe('Issue with cors headers', () => {
  it('now works', async () => {
    const response = await request({
      method: 'OPTIONS',
      url: `${API_URL}data/query`,
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'accept, origin, content-type',
        Origin: 'http://some.domain'
      }
    })

    assert.equal(response.statusCode, 200)

    ;
    [
      'access-control-allow-origin',
      'access-control-allow-headers'
    ]
      .forEach(header => assert(header in response.headers, `Expected ${header} to be in response headers`))

  })
})

describe('API returned 200 OK and an error message for a completely whacked query', () => {
  it('now fails with 400 as it should', async () => {
    const req = request({
      method: 'POST',
      url: `${API_URL}data/query`,
      body: '(╯°□°）╯︵ ┻━┻)'
    })

    try {
      await req
    } catch (error) {
      assert.equal(error.statusCode, 400)
      return
    }

    assert.fail(null, null, 'Expected to fail with response code 400')
  })
})
