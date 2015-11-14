import {assert} from 'chai'
import UrlQuery from '../../../lib/UrlQuery'

describe('UrlQuery', () => {

  describe('#stringify', () => {

    it('stringifies a query', () => {
      const query = {
        unit: ['personer'],
        region: 'K0301',
        tableName: 'intro_deltakere',
        comparisonRegions: [
          'K0104', 'K0105', 'K0106', 'K0219', 'K0220', 'K0228', 'K0230', 'K0231',
          'K0235', 'K0602', 'K1001', 'K1102', 'K1103', 'K1201', 'K1601'
        ],
        dimensions: [{name: 'kjonn', variables: ['1']}],
        year: ['2015']
      }
      assert.equal(
        UrlQuery.stringify(query),
        '$cmp:K0104,K0105,K0106,K0219,K0220,K0228,K0230,K0231,K0235,K0602,K1001,K1102,K1103,K1201,K1601;$u:personer;$y:2015;kjonn:1'
      )
    })


  })
  describe('#parse', () => {

    it('parses a stringified query', () => {
      const query = '$cmp:K0104,K0105,K0106,K0219,K0220,K0228,K0230,K0231,K0235,K0602,K1001,K1102,K1103,K1201,K1601;$u:personer;$y:2015;kjonn:1'

      assert.deepEqual(UrlQuery.parse(query), {
        unit: ['personer'],
        comparisonRegions: [
          'K0104', 'K0105', 'K0106', 'K0219', 'K0220', 'K0228', 'K0230', 'K0231',
          'K0235', 'K0602', 'K1001', 'K1102', 'K1103', 'K1201', 'K1601'
        ],
        dimensions: [{name: 'kjonn', variables: ['1']}],
        year: ['2015']
      })
    })
  })
})
