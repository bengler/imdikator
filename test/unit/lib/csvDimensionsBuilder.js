import {assert} from 'chai'
import csvDimensionsBuilder from '../../../lib/csvDimensionsBuilder'

describe('csvDimensionsBuilder', () => {

  it('it returns the correctly formatted data', () => {
    const input = [{
      name: 'innvkat3',
      variables: [
        'befolkningen_ellers',
        'norskfodte_m_innvf'
      ]
    }]

    const result = csvDimensionsBuilder(input)
    assert.deepEqual(result,
      {
        innvkat3: {
          label: 'Bakgrunn',
          values: {
            befolkningen_ellers: 'Befolkningen unntatt innvandrere',
            norskfodte_m_innvf: 'Norskfødte med innvandrerforeldre'
          }
        }
      }
  )
  })
})
