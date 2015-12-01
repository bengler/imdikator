import {assert} from 'chai'
import {queryToOptions, describeChart} from '../../../lib/chartDescriber'
import allRegions from '../../fixtures/mockRegions'

const CARDS = [
  {
    name: 'befolkning_innvandringsgrunn',
    metadata: {
      description: 'Her ser du innvandrere fordelt på femdelt innvandringsgrunn og kjønn. Innvandringsgrunn er fordelt '
                    + 'på arbeid, familie, flukt, utdanning og andre.',
      terminology: '',
      source: 'SSB',
      measuredAt: '1.1.2014',
      updatedAt: '',
      unitDescriptions: {
        personer: 'antall innvandrere'
      }
    },
  },
  {
    name: 'befolkning_innvandringsgrunn',
    metadata: {
      cardName: '',
      description: 'Her ser du innvandrere fordelt på femdelt innvandringsgrunn og kjønn. Innvandringsgrunn er fordelt '
                    + 'på arbeid, familie, flukt, utdanning og andre.',
      terminology: '',
      source: 'SSB',
      measuredAt: '1.1.2014',
      updatedAt: '',
      unitDescriptions: {
        personer: 'antall innvandrere'
      }
    }
  }
]

function findMockCardByName(name) {
  return CARDS.find(card => card.name === name)
}

describe('queryToOptions', () => {
  // nedbrytning vs avgrensning:
  // groupedBy: dersom variables-arrayet inneholder fler enn ett element så er det alltid en nedbrytning
  // bounds: dersom variables-arrayet inneholder kun ett element så er det alltid en avgrensning

  it('returns a function', () => {
    assert.typeOf(queryToOptions, 'function')
  })

  xit('handles a basic transformation', () => {
    const query = {
      unit: 'personer',
      region: 'K0301',
      tableName: 'befolkning_innvandringsgrunn',
      dimensions: [
        {
          name: 'innvgrunn5',
          variables: ['arbeid', 'flukt']
        },
        {
          name: 'kjonn',
          variables: ['0']
        }
      ],
      year: ['2014']
    }

    const expected = {
      showing: 'antall innvandrere',
      bounds: ['kjønnsfordeling avgrenset til kvinner'],
      groupedBy: ['oppholdsgrunnlag'],
      timePeriod: ['2014'],
      regions: ['Oslo']
    }
    const result = queryToOptions(query, findMockCardByName('befolkning_innvandringsgrunn'), {}, allRegions)
    assert.deepEqual(result, expected)
  })


  xit('handles comparisonRegions', () => {
    const query = {
      unit: 'personer',
      region: 'K0301',
      tableName: 'befolkning_innvandringsgrunn',
      comparisonRegions: ['K0106', 'K0219', 'K0228'],
      dimensions: [
        {
          name: 'innvgrunn5',
          variables: ['arbeid', 'flukt']
        },
        {
          name: 'kjonn',
          variables: ['0']
        }
      ],
      year: ['2014']
    }

    const expected = {
      showing: 'antall innvandrere',
      bounds: ['kjønnsfordeling avgrenset til kvinner'],
      groupedBy: ['oppholdsgrunnlag'],
      timePeriod: ['2014'],
      regions: ['Oslo', 'Fredrikstad', 'Bærum', 'Rælingen']
    }
    const result = queryToOptions(query, findMockCardByName('befolkning_innvandringsgrunn'), {}, allRegions)
    assert.deepEqual(result, expected)
  })


  xit('handles all time periods, including sorting years', () => {
    const query = {
      unit: 'personer',
      region: 'K0301',
      tableName: 'befolkning_innvandringsgrunn',
      dimensions: [
        {
          name: 'innvgrunn5',
          variables: ['arbeid', 'flukt']
        },
        {
          name: 'kjonn',
          variables: ['0']
        }
      ],
      year: 'all'
    }

    const expected = {
      showing: 'antall innvandrere',
      bounds: ['kjønnsfordeling avgrenset til kvinner'],
      groupedBy: ['oppholdsgrunnlag'],
      timePeriod: ['2011', '2012', '2013', '2014'],
      regions: ['Oslo']
    }
    const result = queryToOptions(query, findMockCardByName('befolkning_innvandringsgrunn'), {
      aar: ['2012', '2011', '2013', '2014']
    }, allRegions)
    assert.deepEqual(result, expected)
  })


  xit('handles aldersfordeling', () => {
    const query = {
      unit: 'personer',
      region: 'K0301',
      tableName: 'befolkning_innvandringsgrunn',
      dimensions: [
        {
          name: 'bhgalder',
          variables: ['3']
        },
        {
          name: 'innvgrunn5',
          variables: ['arbeid', 'flukt']
        },
        {
          name: 'kjonn',
          variables: ['0']
        }
      ],
      year: ['2014']
    }

    const expected = {
      showing: 'antall innvandrere',
      bounds: ['aldersfordeling avgrenset til 3 år', 'kjønnsfordeling avgrenset til kvinner'],
      groupedBy: ['oppholdsgrunnlag'],
      timePeriod: ['2014'],
      regions: ['Oslo']
    }
    const result = queryToOptions(query, findMockCardByName('befolkning_innvandringsgrunn'), {}, allRegions)
    assert.deepEqual(result, expected)
  })


  it('handles case where dimension.variables is a string', () => {
    const query = {
      unit: 'personer',
      region: 'K0301',
      tableName: 'befolkning_flytting',
      comparisonRegions: [],
      dimensions: [
        {name: 'vreg3', visible: false, variables: ['alle']},
        {name: 'flytting', variables: 'all'},
        {name: 'innvkat3', variables: ['innvandrere', 'befolkningen_ellers']}
      ],
      year: ['2013']
    }

    const expected = {
      showing: 'antall innvandrere',
      regions: ['Oslo'],
      timePeriod: ['2013'],
      bounds: [],
      groupedBy: ['bakgrunn']
    }
    const result = queryToOptions(query, findMockCardByName('befolkning_innvandringsgrunn'), {}, allRegions)
    assert.deepEqual(result, expected)
  })

})


describe('chartDescriber', () => {

  it('returns a function', () => {
    assert.typeOf(describeChart, 'function')
  })


  it('describes what to show', () => {
    const opts = {
      showing: 'flyktninger'
    }
    assert.equal(describeChart(opts), 'Figuren viser flyktninger.')
  })


  it('describes the bounds', () => {
    const opts = {
      showing: 'flyktninger',
      bounds: ['aldersfordeling avgrenset til 0-3 år', 'kjønnsfordeling avgrenset til kvinner',
        'bakgrunn avgrenset til innvandrere']
    }
    const expected = 'Figuren viser flyktninger med aldersfordeling avgrenset til 0-3 år, kjønnsfordeling avgrenset '
      + 'til kvinner og bakgrunn avgrenset til innvandrere.'
    assert.equal(describeChart(opts), expected)
  })


  it('describes groupedBy', () => {
    const opts = {
      showing: 'flyktninger',
      groupedBy: ['flyktninger', 'befolkningsgrupper']
    }
    const expected = 'Figuren viser flyktninger fordelt etter flyktninger og befolkningsgrupper.'
    assert.equal(describeChart(opts), expected)
  })


  it('describes timePeriod', () => {
    const opts = {
      showing: 'flyktninger',
      timePeriod: ['2013']
    }
    let expected = 'Figuren viser flyktninger i 2013.'
    assert.equal(describeChart(opts), expected)
    opts.timePeriod = ['2013', '2014']
    expected = 'Figuren viser flyktninger i perioden 2013 til 2014.'
    assert.equal(describeChart(opts), expected)
  })


  it('describes regions', () => {
    const opts = {
      showing: 'flyktninger',
      timePeriod: ['2013'],
      regions: ['Sandefjord', 'Drøbak', 'Larvik', 'Bø i Telemark']
    }
    let expected = 'Figuren viser flyktninger i 2013 i Sandefjord, Drøbak, Larvik og Bø i Telemark.'
    assert.equal(describeChart(opts), expected)

    opts.regions = ['Sandefjord']
    opts.comparisonType = 'kommuner'
    expected = 'Figuren viser flyktninger i 2013 i Sandefjord.'
    assert.equal(describeChart(opts), expected)
  })


  it('describes everything at once', () => {
    const opts = {
      showing: 'flyktninger',
      bounds: ['aldersfordeling avgrenset til 0-3 år', 'kjønnsfordeling avgrenset til kvinner', 'bakgrunn avgrenset til innvandrere'],
      groupedBy: ['flyktninger', 'befolkningsgrupper'],
      timePeriod: ['2012', '2014'],
      regions: ['Sandefjord', 'Drøbak', 'Larvik', 'Bø i Telemark']
    }
    const expected = 'Figuren viser flyktninger med aldersfordeling avgrenset til 0-3 år, kjønnsfordeling avgrenset til'
      + ' kvinner og bakgrunn avgrenset til innvandrere fordelt etter flyktninger og befolkningsgrupper i perioden 2012 til'
      + ' 2014 i Sandefjord, Drøbak, Larvik og Bø i Telemark.'
    assert.equal(describeChart(opts), expected)
  })

})
