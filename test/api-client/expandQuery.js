import {assert} from 'chai'
import expandQuery from '../../lib/api-client/expandQuery'
import examples from './exampleQueries'

describe('Translating to Visma-API compliant queries', () => {
  examples.forEach(example => {
    describe(example.desc, () => {
      it('returns expected query', () => {

        const actual = expandQuery(example.query, example.region, example.metadata)
        assert.deepEqual(example.expect, actual)
      })
    })
  })

})
