import {assert} from 'chai'
import toVismaQuery from '../../../lib/api-client/toVismaQuery'
import examples from './exampleQueries'

describe('Translating to Visma-API compliant queries', () => {
  examples.forEach(example => {
    describe(example.test, () => {
      it('returns expected query', () => {
        const actual = toVismaQuery(example.query)
        assert.deepEqual(example.expect, actual)
      })
    })
  })

})
