import {assert} from 'chai'
import * as APIClient from '../../../lib/api-client/visma'
import * as json from '../../../lib/http/json'

describe('Creating a client', () => {
  it('throws an error if required options are missing', () => {
    assert.throws(() => APIClient.create({connector: json}), /Missing required option/)
    assert.throws(() => APIClient.create({baseUrl: 'http://foo.bar'}), /Missing required option/)
  })

  it('does not throw an error if required options are given', () => {
    assert.doesNotThrow(() => {
      APIClient.create({
        baseUrl: 'http://imdifakta.azurewebsites.net/api/v1/',
        connector: json
      })
    })
  })
})
