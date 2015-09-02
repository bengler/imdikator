import 'babelify/polyfill'
import React from 'react'
import Router from '../lib/Router'
import ShowComponentDoc from './components/ShowComponentDoc'
import compileRoutes from '../lib/compileRoutes'
import dasherize from 'dasherize'

/* eslint import/no-require: 1 */

let routeMappings

class IndexContainer {
  render() {
    return (
      <div>
        <h2>Components documentation</h2>
        <ul>
          {
            Object.keys(routeMappings)
              .filter(path => routeMappings[path] !== IndexContainer)
              .map(path => {
                const Component = routeMappings[path]
                return (
                  <li><a href={path}>{Component.name}</a></li>
                )
              })
          }
        </ul>
      </div>
    )
  }
}

const chartRoutes = [
  require('../components/charts/area-chart/StackedAreaChart'),
  require('../components/charts/bar-chart/BarChart'),
  require('../components/charts/bar-chart/BenchmarkChart'),
  require('../components/charts/bar-chart/StackedBarChart'),
  require('../components/charts/bubble-chart/BubbleChart'),
  require('../components/charts/line-chart/LineChart'),
  require('../components/charts/map-chart/MapChart'),
  require('../components/charts/pyramid-chart/PyramidChart'),
  require('../components/charts/table-chart/TableChart')
  // Add more chart components here
]
  .reduce((routes, component) => {
    routes['/docs/charts/' + dasherize(component.name)] = component
    return routes
  }, {})


routeMappings = {
  '/docs': IndexContainer,
  '/docs/table-presenter': require('../components/elements/TablePresenter'),
  // Add more components here
  ...chartRoutes
}

const routes = compileRoutes(routeMappings)

const container = document.getElementById('main')
const router = Router(routes, match => {

  const Component = match.handler

  if (Component == IndexContainer) {
    return React.render(<IndexContainer/>, container)
  }

  React.render(<ShowComponentDoc component={Component}/>, container)
})

router.start()
