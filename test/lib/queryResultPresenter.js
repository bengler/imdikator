import {assert} from 'chai'

import {queryResultPresenter} from '../../lib/queryResultPresenter'

const config = {
  bosetting: {
    chartKind: 'bar',
    dimensions: [
      {
        label: 'aar'
      },
      {
        label: 'bosetting',
        include: ['anmodning', 'vedtak', 'bosatt']
      }
    ],
  },

  befolkning: {
    table: 'befolkninghovedgruppe',
    dimensions: [
      {
        label: 'innvkat5'
      },
      {
        label: 'kjonn'
      }
    ]
  }
}

const query = {
  TableName: 'befolkninghovedgruppe',
  Conditions: {
    aar: ['2012', '2013', '2014'],
    enhet: ['prosent'],
    innvkat5: ['innvandrere'],
    kjonn: ['0', '1'],
    kommuneId: ['0301']
  },
  Include: ['aar', 'tabellvariabel', 'enhet', 'innvkat5', 'kjonn']
}

describe('queryResultPresenter', () => {
  it('collects dimensions specified in the config for the table', () => {
    const pres = queryResultPresenter({}, {}, config.befolkning)
    assert.deepEqual(pres.dimensions, ['innvkat5', 'kjonn'])
  })

  it('removes time dimension if the query only has one distinct year', () => {
    const qu = Object.assign({}, query, {
      Conditions: {aar: ['2015']}
    })
    const pres = queryResultPresenter(qu, {}, config.bosetting)
    assert(pres.dimensions.indexOf('aar') == -1)
  })

  it('sorts aar dimension last for line charts', () => {
    const qu = Object.assign({}, query, {
      Include: ['aar', 'bosetting']
    })

    let co = Object.assign({}, config.bosetting, {chartKind: 'bar'})
    let pres = queryResultPresenter(qu, {}, co)
    assert.deepEqual(pres.dimensions, ['aar', 'bosetting'])

    co = Object.assign({}, config.bosetting, {chartKind: 'line'})
    pres = queryResultPresenter(qu, {}, co)
    assert.deepEqual(pres.dimensions, ['bosetting', 'aar'])
  })

  it('figures out the unit to use when presenting based on the query', () => {
    const qu = Object.assign({}, query, {
      Conditions: {enhet: ['kustom']}
    })
    const pres = queryResultPresenter(qu, {}, config.befolkning)
    assert.equal(pres.unit, 'kustom')
  })

  it('includes the query result as a rows property', () => {
    const result = [{something: 'here'}]
    const pres = queryResultPresenter(query, result, config.befolkning)
    assert.deepEqual(pres.rows, result)
  })
})
