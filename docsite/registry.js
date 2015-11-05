import React from 'react'
import ShowComponentDoc from './components/ShowComponentDoc'
import FilterSelect from '../components/elements/filter/FilterSelect'
import RegionFilterSelect from '../components/elements/filter/RegionFilterSelect'
import RegionSearch from '../components/elements/RegionSearch'
import humanizeList from 'humanize-list'
// Registry of components that will be available on doc-site

function wrapInDocumenter(Component, props = {}) {
  return React.createClass({
    displayName: Component.name,
    render() {
      return <ShowComponentDoc componentProps={props} component={Component}/>
    }
  })
}

const REGIONS = []
  .concat(require('../data/bydeler'))
  .concat(require('../data/fylker'))
  .concat(require('../data/kommuner'))
  .concat(require('../data/naeringsregioner'))


/* eslint import/no-require: 1 */
export default [
  {
    name: 'examples',
    title: 'Examples / demos',
    components: []
  },
  {
    name: 'charts',
    title: 'Charts',
    components: [
      require('../components/charts/area-chart/StackedAreaChart'),
      require('../components/charts/bar-chart/BarChart'),
      require('../components/charts/bar-chart/BenchmarkChart'),
      require('../components/charts/bar-chart/StackedBarChart'),
      require('../components/charts/bubble-chart/BubbleChart'),
      require('../components/charts/line-chart/LineChart'),
      require('../components/charts/map-chart/MapChart'),
      require('../components/charts/pyramid-chart/PyramidChart'),
      require('../components/charts/table-chart/TableChart')
    ].map(wrapInDocumenter)
  },
  {
    name: 'elements',
    title: 'Elements',
    components: [
      wrapInDocumenter(require('../components/elements/filter/FilterSelect'), {
        label: 'Kjønn',
        value: ['Kvinne'],
        limited: true,
        choices: [['Mann'], ['Kvinne'], ['Annet']],
        renderChoice(choice, i, choices) {
          return choice.map(item => item.toUpperCase())
        }
      }),
      wrapInDocumenter(require('../components/elements/RegionChildList'), {
        childRegions: REGIONS.slice(0, 20),
        region: REGIONS.find(region => region.type === 'municipality'),
        createLinkToRegion: region => `/link/to/${region.prefixedCode}`
      }),

      wrapInDocumenter(RegionFilterSelect, {
        label: 'Sammenlignet med',
        value: REGIONS.slice(0, 2),
        choices: REGIONS,
        renderChoice(choice, i, choices) {
          return humanizeList(choice.map(region => region.name), {conjunction: 'og'})
        }
      }),

      wrapInDocumenter(RegionSearch, {
        regions: REGIONS
      }),

      wrapInDocumenter(require('../components/elements/filter/FilterBar'), {
        filters: [
          {
            name: 'region',
            component: RegionFilterSelect,
            props: {
              label: 'Sammenlignet med',
              value: REGIONS.slice(0, 2),
              choices: REGIONS,
              renderChoice(choice, i, choices) {
                return humanizeList(choice.map(region => region.name), {conjunction: 'og'})
              }
            }
          },
          {
            name: 'gender',
            component: FilterSelect,
            props: {
              label: 'Kjønn',
              value: ['Kvinne', 'Mann'],
              limited: false,
              choices: [['Mann'], ['Kvinne'], ['Kvinne', 'Mann']],
              renderChoice(choice, i, choices) {
                return humanizeList(choice, {conjunction: 'og'})
              }
            }
          }
        ]
      }),

      wrapInDocumenter(require('../components/elements/filter/RegionPicker'), {
        choices: REGIONS,
        groups: [
          {
            title: 'Lignende',
            name: 'similar',
            items: REGIONS.slice(0, 2),
            description: (
              <span>
                Om dette utvalget, osv <a href="#">Les mer her</a>
              </span>
            )
          },
          {title: 'Anbefalte', name: 'recommended', items: REGIONS.slice(-3)}
        ]
      })
    ]
  }
]
