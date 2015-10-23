import {assert} from 'chai'

import {queryResultPresenter} from '../../lib/queryResultPresenter'

const QUERY = {
  tableName: 'befolkninghovedgruppe',
  year: ['2012', '2013', '2014'],
  unit: ['prosent'],
  region: 'K0301',
  dimensions: [
    {name: 'innvkat5', variables: ['innvandrere']},
    {name: 'kjonn', variables: ['0', '1']}
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

    const pres = queryResultPresenter(query, [], {chartKind: 'bar'})
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

    const pres = queryResultPresenter(query, [], {chartKind: 'bar'})
    assert.deepEqual(pres.dimensions, ['innvkat5', 'kjonn'])
  })

  it('removes time dimension if the query only has one distinct year', () => {
    const query = Object.assign({}, QUERY, {
      year: ['2015']
    })
    const pres = queryResultPresenter(query, [], {chartKind: 'bar'})
    assert(!pres.dimensions.includes('aar'))
  })

  it('adds the region header keys', () => {
    const query = {
      tableName: 'befolkninghovedgruppe',
      region: 'K0301',
      comparisonRegions: ['F06'],
      unit: ['prosent'],
      dimensions: [
        {name: 'innvkat5', variables: ['innvandrere']},
        {name: 'kjonn', variables: ['0', '1']}
      ]
    }
    const pres = queryResultPresenter(query, [], {chartKind: 'pyramid'})
    assert.deepEqual(pres.dimensions, ['region', 'innvkat5', 'kjonn'])
  })

  ;['bar', 'stackedBar', 'pyramid'].forEach(chartKind => {
    it(`sorts aar dimension last for ${chartKind}`, () => {
      const query = Object.assign({}, QUERY, {
        dimensions: [
          {name: 'innvkat5', variables: ['innvandrere']}
        ]
      })
      const pres = queryResultPresenter(query, [], {chartKind: chartKind})
      assert.equal(pres.dimensions.slice(-1)[0], 'aar')
    })
  })

  ;['line', 'stackedArea'].forEach(chartKind => {
    it(`always includes year as last dimension ${chartKind}`, () => {
      const query = Object.assign({}, QUERY, {
        dimensions: [
          {name: 'innvkat5', variables: ['innvandrere']}
        ]
      })
      const pres = queryResultPresenter(query, [], {chartKind: chartKind})
      assert.equal(pres.dimensions.slice(-1)[0], 'aar')
    })
  })

  it('figures out the unit to use when presenting based on the query', () => {
    const qu = Object.assign({}, QUERY, {
      unit: 'kustom'
    })
    const pres = queryResultPresenter(qu, [], {chartKind: 'bar'})
    assert.equal(pres.unit, 'kustom')
  })

  it('includes the query result as a rows property', () => {
    const result = [{something: 'here'}]
    const pres = queryResultPresenter(QUERY, result, {chartKind: 'bar'})
    assert.deepEqual(pres.rows, result)
  })

  it('parses tabellvariabel into value property', () => {
    const result = [{tabellvariabel: '29'}]
    const pres = queryResultPresenter(QUERY, result, {chartKind: 'bar'})
    assert.equal(pres.rows[0].value, 29)
  })

  it('marks anonymized data', () => {
    const result = [{tabellvariabel: ':'}]
    const pres = queryResultPresenter(QUERY, result, {chartKind: 'bar'})
    assert.property(pres.rows[0], 'anonymized')
    assert.ok(pres.rows[0].anonymized)
    assert.equal(pres.rows[0].value, 4)
  })

  it('anonymized data has formattedValue set', () => {
    const result = [{tabellvariabel: ':'}]
    const pres = queryResultPresenter(QUERY, result, {chartKind: 'bar'})
    assert.property(pres.rows[0], 'formattedValue')
    assert.equal(pres.rows[0].formattedValue, 'Under 5')
  })

  it('marks missing data', () => {
    const result = [{tabellvariabel: '.'}]
    const pres = queryResultPresenter(QUERY, result, {chartKind: 'bar'})
    assert.property(pres.rows[0], 'missingData')
    assert.ok(pres.rows[0].missingData)
    assert.equal(pres.rows[0].value, 0)
  })

  it('missing data has formattedValue set', () => {
    const result = [{tabellvariabel: '.'}]
    const pres = queryResultPresenter(QUERY, result, {chartKind: 'bar'})
    assert.property(pres.rows[0], 'formattedValue')
    assert.equal(pres.rows[0].formattedValue, 'Mangler data')
  })
})
