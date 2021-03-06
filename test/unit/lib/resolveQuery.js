import {assert} from 'chai'
import resolveQuery from '../../../lib/resolveQuery'

describe('resolveQuery', () => {

  it('resolves year: latest to the full list of available years', () => {

    const exampleQuery = {
      table: 'befolkninghovedgruppe',
      unit: 'personer',
      year: 'latest',
      comparisonRegions: [],
      dimensions: [
        {
          name: 'innvkat5',
          variables: [
            'alle'
          ]
        },
        {
          name: 'kjonn',
          variables: [
            'alle'
          ]
        }
      ]
    }
    const resolved = resolveQuery({type: 'municipality', code: '0103'}, exampleQuery, {
      kommuneNr: ['0103'],
      aar: ['2014'],
      innvkat5: ['alle'],
      kjonn: ['0', '1']
    })
    assert.equal(resolved.year, '2014')
  })
})
