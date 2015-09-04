import React from 'react'
import ShowComponentDoc from './components/ShowComponentDoc'
// Registry of components that will be available on doc-site

function wrapInDocumenter(Component) {
  return React.createClass({
    displayName: Component.name,
    render() {
      return <ShowComponentDoc component={Component}/>
    }
  })
}
export default [
  {
    name: 'examples',
    title: 'Examples / demos',
    components: [
      require('./examples/TablePresenterExample')
    ]
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
  }
]
