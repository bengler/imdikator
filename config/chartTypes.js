import BarChart from '../components/charts/bar-chart/BarChart'
import BenchmarkChart from '../components/charts/bar-chart/BenchmarkChart'
import StackedBarChart from '../components/charts/bar-chart/StackedBarChart'
import StackedAreaChart from '../components/charts/area-chart/StackedAreaChart'
import LineChart from '../components/charts/line-chart/LineChart'
import BubbleChart from '../components/charts/bubble-chart/BubbleChart'
//import MapChart from '../components/charts/map-chart/MapChart'
import PyramidChart from '../components/charts/pyramid-chart/PyramidChart'
import TableChart from '../components/charts/table-chart/TableChart'
import {keyBy} from 'lodash'

const CHART_TYPES = [
  {
    name: 'stackedArea',
    capabilities: {
      dimensions: 1
    },
    component: StackedAreaChart
  },
  {
    name: 'line',
    capabilities: {
      dimensions: 1
    },
    component: LineChart
  },
  {
    name: 'bar',
    capabilities: {
      dimensions: 2
    },
    component: BarChart
  },
  {
    name: 'stackedBar',
    capabilities: {
      dimensions: 2
    },
    component: StackedBarChart
  },
  {
    name: 'pyramid',
    capabilities: {
      dimensions: 3
    },
    component: PyramidChart
  },
  {
    name: 'benchmark',
    capabilities: {
      dimensions: 1,
      variables: 1
    },
    component: BenchmarkChart
  },
  {
    name: 'bubble',
    capabilities: {
      dimensions: 2
    },
    component: BubbleChart
  },
  //{
  //  name: 'map',
  //  capabilities: {
  //    dimensions: 1,
  //    variables: 1
  //  },
  //  component: MapChart
  //},
  {
    name: 'table',
    capabilities: {},
    component: TableChart
  }
]

export const CHARTS = keyBy(CHART_TYPES, 'name')
