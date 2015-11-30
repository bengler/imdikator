import {assert} from 'chai'
import toVismaQuery from '../../../lib/api-client/toVismaCompareQuery'
import examples from './exampleCompareQueries'

describe('Translating to Visma compare query', () => {
  examples.forEach(example => {
    describe(example.test, () => {
      it('returns expected query', () => {
        const actual = toVismaQuery(example.query)
        assert.deepEqual(example.expect, actual)
      })
    })
  })

})
