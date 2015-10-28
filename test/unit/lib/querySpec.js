import {assert} from 'chai'
import {getQuerySpec} from '../../../lib/querySpec'
import {CHARTS} from '../../../config/chartTypes'

const HEADER_GROUP = {
  aar: ['2010', '2012'],
  enhet: ['prosent', 'personer'],
  kjonn: ['alle', '0', '1'],
  innvkat5: ['alle', 'innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf'],
  kommuneNr: ['0511', '0428'],
  bydelNr: ['030102', '030104'],
  fylkeNr: ['02', '03'],
  naringsregionNr: ['05', '07'],
}

const QUERY = {
  table: 'befolkninghovedgruppe',
  region: 'K0511',
  unit: ['personer'],
  //year: <inserted by tests>,
  //comparisonRegions: <inserted by tests>,
  dimensions: [
    {
      name: 'innvkat5',
      variables: [
        'innvandrere',
        'befolkningen_ellers',
        'norskfodte_m_innvf',
        'bef_u_innv_og_norskf'
      ]
    },
    {
      name: 'kjonn',
      variables: ['alle']
    }
  ]
}

describe('getQuerySpec', () => {

  describe('when aggregated value is not in possible header group values', () => {
    const query = Object.assign({}, QUERY, {
      year: ['2010'],
      comparisonRegions: []
    })

    it('works', () => {
      const viewOpts = {
        tab: {name: 'latest'},
        headerGroup: Object.assign({}, HEADER_GROUP, {
          innvkat5: ['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']
        }),
        chart: CHARTS.bar
      }

      const actual = getQuerySpec(query, viewOpts)
      assert.deepEqual(actual, [
        {
          name: 'comparisonRegions',
          fixed: true,
          locked: false,
          choices: ['K0511', 'K0428', 'F02', 'F03', 'B030102', 'B030104', 'N05', 'N07']
        },
        {
          name: 'year',
          fixed: true,
          locked: false,
          choices: [['2010'], ['2012']]
        },
        {
          name: 'innvkat5',
          locked: true,
          choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
        },
        {
          name: 'kjonn',
          locked: false,
          choices: [['alle'/*skjult*/], ['0', '1'/*vis*/]]
        },
        {
          name: 'unit',
          fixed: true,
          locked: false,
          choices: [['prosent'], ['personer']]
        }
      ])
    })
  })

  describe('query for latest tab', () => {
    describe('when no comparisonRegion is selected', () => {
      const query = Object.assign({}, QUERY, {
        year: ['2010'],
        comparisonRegions: []
      })

      it('works', () => {
        const viewOpts = {
          tab: {name: 'latest'},
          headerGroup: HEADER_GROUP,
          chart: CHARTS.bar
        }

        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            locked: false,
            choices: ['K0511', 'K0428', 'F02', 'F03', 'B030102', 'B030104', 'N05', 'N07']
          },
          {
            name: 'year',
            fixed: true,
            locked: false,
            choices: [['2010'], ['2012']]
          },
          {
            name: 'innvkat5',
            locked: true,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            locked: false,
            choices: [['alle'/*skjult*/], ['0', '1'/*vis*/]]
          },
          {
            name: 'unit',
            fixed: true,
            locked: false,
            choices: [['prosent'], ['personer']]
          }
        ])
      })
    })
    describe('when one or more comparisonRegions are selected', () => {
      const query = Object.assign({}, QUERY, {
        year: ['2010'],
        comparisonRegions: ['K0426']
      })

      it('works', () => {
        const viewOpts = {
          tab: {name: 'latest'},
          headerGroup: HEADER_GROUP,
          chart: CHARTS.bar
        }

        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            locked: false,
            choices: ['K0511', 'K0428', 'F02', 'F03', 'B030102', 'B030104', 'N05', 'N07']
          },
          {
            name: 'year',
            fixed: true,
            locked: false,
            choices: [['2010'], ['2012']]
          },
          {
            name: 'innvkat5',
            locked: true,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            locked: false,
            choices: [['alle'], ['0'], ['1']]
          },
          {
            name: 'unit',
            fixed: true,
            locked: false,
            choices: [['prosent'], ['personer']]
          }
        ])
      })
    })
  })
  describe('query for chronological tab', () => {
    describe('when no comparisonRegion is selected', () => {
      const query = Object.assign({}, QUERY, {
        year: 'all',
        comparisonRegions: []
      })
      it('works', () => {
        const viewOpts = {
          tab: {name: 'chronological'},
          headerGroup: HEADER_GROUP,
          chart: CHARTS.bar
        }

        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            locked: false,
            choices: ['K0511', 'K0428', 'F02', 'F03', 'B030102', 'B030104', 'N05', 'N07']
          },
          {
            name: 'year',
            fixed: true,
            locked: true,
            choices: ['all']
          },
          {
            name: 'innvkat5',
            locked: true,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            locked: false,
            choices: [['alle'], ['0', '1']]
          },
          {
            name: 'unit',
            fixed: true,
            locked: false,
            choices: [['prosent'], ['personer']]
          }
        ])
      })
    })
    describe('when one or more comparisonRegions are selected', () => {

      const query = Object.assign({}, QUERY, {
        year: 'all',
        comparisonRegions: ['K0426']
      })

      it('works', () => {
        const viewOpts = {
          tab: {name: 'chronological'},
          headerGroup: HEADER_GROUP,
          chart: CHARTS.bar
        }
        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            locked: false,
            choices: ['K0511', 'K0428', 'F02', 'F03', 'B030102', 'B030104', 'N05', 'N07']
          },
          {
            name: 'year',
            fixed: true,
            locked: true,
            choices: ['all']
          },
          {
            name: 'innvkat5',
            locked: true,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            locked: false,
            choices: [['alle'], ['0'], ['1']]
          },
          {
            name: 'unit',
            fixed: true,
            locked: false,
            choices: [['prosent'], ['personer']]
          }
        ])
      })
    })
    describe('with configured dimensions', () => {

      it('works', () => {
        const query = Object.assign({}, QUERY, {
          year: ['2010'],
          comparisonRegions: []
        })
        const viewOpts = {
          tab: {name: 'latest'},
          headerGroup: HEADER_GROUP,
          chart: CHARTS.bar,
          dimensionsConfig: {
            innvkat5: {
              include: ['innvandrere', 'bef_u_innv_og_norskf', 'norskfodte_m_innvf']
            }
          }
        }
        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            locked: false,
            choices: ['K0511', 'K0428', 'F02', 'F03', 'B030102', 'B030104', 'N05', 'N07']
          },
          {
            name: 'year',
            fixed: true,
            locked: false,
            choices: [['2010'], ['2012']]
          },
          {
            name: 'innvkat5',
            locked: true,
            choices: [['innvandrere', 'bef_u_innv_og_norskf', 'norskfodte_m_innvf']]
          },
          {
            name: 'kjonn',
            locked: false,
            choices: [['alle'], ['0', '1']]
          },
          {
            name: 'unit',
            fixed: true,
            locked: false,
            choices: [['prosent'], ['personer']]
          }
        ])
      })
    })
  })
})
