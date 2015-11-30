import {assert} from 'chai'
import {getQuerySpec} from '../../../lib/querySpec'
import {CHARTS} from '../../../config/chartTypes'
import allRegions from '../../fixtures/mockRegions'


const REGION_PREFIXES = allRegions.map(reg => reg.prefixedCode)

const HEADER_GROUP = {
  aar: ['2010', '2012'],
  enhet: ['prosent', 'personer'],
  kjonn: ['alle', '0', '1'],
  innvkat5: ['alle', 'innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']
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
        chart: CHARTS.bar,
        allRegions: allRegions
      }

      const actual = getQuerySpec(query, viewOpts)
      assert.deepEqual(actual, [
        {
          name: 'comparisonRegions',
          fixed: true,
          locked: false,
          hidden: false,
          choices: REGION_PREFIXES
        },
        {
          name: 'year',
          fixed: true,
          hidden: false,
          locked: false,
          choices: [['2010'], ['2012']]
        },
        {
          name: 'innvkat5',
          locked: true,
          hidden: false,
          constrained: false,
          choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
        },
        {
          name: 'kjonn',
          locked: false,
          hidden: false,
          constrained: false,
          choices: [['alle'/*skjult*/], ['0', '1'/*vis*/]]
        },
        {
          name: 'unit',
          fixed: true,
          hidden: false,
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
          chart: CHARTS.bar,
          allRegions: allRegions
        }

        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            hidden: false,
            locked: false,
            choices: REGION_PREFIXES
          },
          {
            name: 'year',
            fixed: true,
            hidden: false,
            locked: false,
            choices: [['2010'], ['2012']]
          },
          {
            name: 'innvkat5',
            locked: true,
            hidden: false,
            constrained: false,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            locked: false,
            hidden: false,
            constrained: false,
            choices: [['alle'/*skjult*/], ['0', '1'/*vis*/]]
          },
          {
            name: 'unit',
            fixed: true,
            hidden: false,
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
          chart: CHARTS.bar,
          allRegions: allRegions
        }

        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            hidden: false,
            locked: false,
            choices: REGION_PREFIXES
          },
          {
            name: 'year',
            fixed: true,
            hidden: false,
            locked: false,
            choices: [['2010'], ['2012']]
          },
          {
            name: 'innvkat5',
            constrained: false,
            hidden: false,
            locked: true,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            locked: false,
            constrained: true,
            hidden: false,
            choices: [['alle'], ['0'], ['1']]
          },
          {
            name: 'unit',
            fixed: true,
            hidden: false,
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
          chart: CHARTS.bar,
          allRegions: allRegions
        }

        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            hidden: false,
            locked: false,
            choices: REGION_PREFIXES
          },
          {
            name: 'year',
            fixed: true,
            hidden: false,
            locked: true,
            choices: ['all']
          },
          {
            name: 'innvkat5',
            locked: true,
            constrained: false,
            hidden: false,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            constrained: false,
            locked: false,
            hidden: false,
            choices: [['alle'], ['0', '1']]
          },
          {
            name: 'unit',
            fixed: true,
            hidden: false,
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
          chart: CHARTS.bar,
          allRegions: allRegions
        }
        const actual = getQuerySpec(query, viewOpts)
        assert.deepEqual(actual, [
          {
            name: 'comparisonRegions',
            fixed: true,
            hidden: false,
            locked: false,
            choices: REGION_PREFIXES
          },
          {
            name: 'year',
            fixed: true,
            hidden: false,
            locked: true,
            choices: ['all']
          },
          {
            name: 'innvkat5',
            constrained: false,
            hidden: false,
            locked: true,
            choices: [['innvandrere', 'befolkningen_ellers', 'norskfodte_m_innvf', 'bef_u_innv_og_norskf']]
          },
          {
            name: 'kjonn',
            constrained: true,
            hidden: false,
            locked: false,
            choices: [['alle'], ['0'], ['1']]
          },
          {
            name: 'unit',
            fixed: true,
            hidden: false,
            locked: false,
            choices: [['prosent'], ['personer']]
          }
        ])
      })
    })
  })
})
