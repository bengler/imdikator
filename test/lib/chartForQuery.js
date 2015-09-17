import {assert} from 'chai'
import {chartForQuery} from '../../lib/chartForQuery'

describe('chartForQuery', () => {
  it('selects the preferred chartKind of no other was determined', () => {
    assert.equal(chartForQuery({}, 'bar'), 'bar')
    assert.equal(chartForQuery({}, 'funky'), 'funky')
  })

  it('prefers line chart for data series with multiple years', () => {
    const query = {
      include: {
        aar: ['2014', '2015']
      }
    }
    assert.equal(chartForQuery(query, 'bar'), 'line')
  })

  it('knows that the preferred chart kind is among possible charts for query', () => {
    const query = {
      include: {
        aar: ['2014', '2015']
      }
    }
    assert.equal(chartForQuery(query, 'bar'), 'line')
    assert.equal(chartForQuery(query, 'stackedArea'), 'stackedArea')
  })
})
