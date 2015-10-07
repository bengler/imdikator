import {assert} from 'chai'
import {queryResultFilter} from '../../lib/queryResultFilter'

describe('queryResultFilter', () => {

  it('returns the input by default', () => {
    const filtered = queryResultFilter(['data'], 'whatisthisIdonteven')
    assert.deepEqual(filtered, ['data'])
  })

  describe('bubble charts', () => {

    const chartKind = 'bubble'

    it('removes landbakgrunn "alle"', () => {
      const result = [
        {tabellvariabel: '1000'},
        {tabellvariabel: '29', landbakgrunn: '1'}
      ]

      const filtered = queryResultFilter(result, chartKind)
      assert.deepEqual(filtered, [{tabellvariabel: '1000'}])
    })

    it('removes zero data', () => {
      const result = [
        {tabellvariabel: '1000'},
        {tabellvariabel: '0'},
      ]

      const filtered = queryResultFilter(result, chartKind)
      assert.deepEqual(filtered, [{tabellvariabel: '1000'}])

    })
  })
})
