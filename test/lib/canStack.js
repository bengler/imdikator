import {assert} from 'chai'
import {canStack} from '../../lib/canStack'

const QUERY = {
  tableName: 'befolkninghovedgruppetidsserie',
  dimensions: [
    {name: 'aar', variables: ['2012', '2013', '2014']},
    {name: 'enhet', variables: ['prosent']},
    {name: 'innvkat5', variables: ['innvandrere']},
    {name: 'kjonn', variables: ['0', '1']},
    {name: 'kommuneId', variables: ['0301']}
  ]
}

describe('canStack', () => {

  it('cannot stack data across several years', () => {
    const newQuery = Object.assign({}, QUERY)
    newQuery.dimensions[0].variables = ['2015']
    let res = canStack(newQuery, [])
    assert(res)

    newQuery.dimensions[0].variables = ['2015', '2014']
    res = canStack(newQuery, [])
    assert(!res)
  })

  it('cannot stack . data', () => {
    const data = [
      {aar: '2015', tabellvariabel: '29'},
      {aar: '2015', tabellvariabel: '.'}
    ]
    const res = canStack(null, data)
    assert(res === false, 'Should not stack . data')
  })

  it('cannot stack : data', () => {
    const data = [
      {aar: '2015', tabellvariabel: '29'},
      {aar: '2015', tabellvariabel: ':'}
    ]

    const res = canStack(null, data)
    assert(res === false, 'Should not stack : data')
  })

  // TODO: We need a list of variables that can be added together for each table
  it('can stack data', () => {
    const data = [
      {aar: '2015', tabellvariabel: '129', innvkat5: 'innvandrere'},
      {aar: '2015', tabellvariabel: '229', innvkat5: 'bef_u_innv_og_norskf'},
      {aar: '2015', tabellvariabel: '329', innvkat5: 'norskfodte_m_innvf'},
      {aar: '2015', tabellvariabel: '429', innvkat5: 'innvandrere'},
    ]

    const res = canStack(null, data)
    assert(res === true, 'Should stack')
  })

})
