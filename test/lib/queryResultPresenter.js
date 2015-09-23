import {assert} from 'chai'

import {queryResultPresenter} from '../../lib/queryResultPresenter'

const QUERY = {
  tableName: 'befolkninghovedgruppe',
  dimensions: [
    {name: 'aar', variables: ['2012', '2013', '2014']},
    {name: 'enhet', variables: ['prosent']},
    {name: 'innvkat5', variables: ['innvandrere']},
    {name: 'kjonn', variables: ['0', '1']},
    {name: 'kommuneId', variables: ['0301']}
  ]
}

describe('queryResultPresenter', () => {
  it('does not collect invisible dimensions specified in the query', () => {
    const query = {
      table: 'befolkninghovedgruppe',
      dimensions: [
        {
          name: 'innvkat5',
          visible: false
        },
        {
          name: 'kjonn'
        }
      ]
    }

    const pres = queryResultPresenter(query, {}, {chartKind: 'bar'})
    assert.deepEqual(pres.dimensions, ['kjonn'])
  })

  it('collects dimensions specified in the query', () => {
    const query = {
      table: 'befolkninghovedgruppe',
      dimensions: [
        {
          name: 'innvkat5'
        },
        {
          name: 'kjonn'
        }
      ]
    }

    const pres = queryResultPresenter(query, {}, {chartKind: 'bar'})
    assert.deepEqual(pres.dimensions, ['innvkat5', 'kjonn'])
  })

  it('removes time dimension if the query only has one distinct year', () => {
    const query = Object.assign({}, QUERY, {
      dimensions: QUERY.dimensions.map(dim => {
        return dim.name == 'aar' ? {aar: ['2015']} : dim
      })
    })
    const pres = queryResultPresenter(query, {}, {chartKind: 'bar'})
    assert(!pres.dimensions.includes('aar'))
  })

  it('sorts aar dimension last for line charts', () => {
    const query = Object.assign({}, QUERY)

    const pres = queryResultPresenter(query, {}, {chartKind: 'line'})
    assert.equal(pres.dimensions.slice(-1)[0], 'aar')
  })

  it('figures out the unit to use when presenting based on the query', () => {
    const qu = Object.assign({}, QUERY, {
      unit: 'kustom'
    })
    const pres = queryResultPresenter(qu, {}, {})
    assert.equal(pres.unit, 'kustom')
  })

  it('includes the query result as a rows property', () => {
    const result = [{something: 'here'}]
    const pres = queryResultPresenter(QUERY, result, {})
    assert.deepEqual(pres.rows, result)
  })
})
