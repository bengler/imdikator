import {assert} from 'chai'
import resolveQuery from '../../lib/resolveQuery'

describe('resolveQuery', () => {

  it('resolves year: latest to the full list of available years', () => {

    const exampleQuery = {
      table: 'befolkninghovedgruppe',
      unit: 'personer',
      time: 'latest',
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
    const resolved = resolveQuery({type: 'municipality', code: '0103'}, exampleQuery, [{
      kommuneNr: ['0103'],
      aar: ['2014']
    }])
    const expected = resolved.dimensions.find(dimension => dimension.name == 'aar' && dimension.variables[0] == '2014')
    assert(expected, 'Expected `resolved.dimensions` to include year = 2014, instead got ' + JSON.stringify(resolved.dimensions))
  })
})
