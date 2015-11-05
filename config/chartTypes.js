import BarChart from '../components/charts/bar-chart/BarChart'
import BenchmarkChart from '../components/charts/bar-chart/BenchmarkChart'
import StackedBarChart from '../components/charts/bar-chart/StackedBarChart'
import StackedAreaChart from '../components/charts/area-chart/StackedAreaChart'
import LineChart from '../components/charts/line-chart/LineChart'
import BubbleChart from '../components/charts/bubble-chart/BubbleChart'
import MapChart from '../components/charts/map-chart/MapChart'
import PyramidChart from '../components/charts/pyramid-chart/PyramidChart'
import TableChart from '../components/charts/table-chart/TableChart'
import indexBy from 'lodash.indexby'

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
    maxBarWidth: 50,
    minWidthPerCategory: 120,
    capabilities: {
      dimensions: 2
    },
    component: BarChart
  },
  {
    name: 'stackedBar',
    maxBarWidth: 85,
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
    maxBarWidth: 50,
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
  {
    name: 'map',
    capabilities: {
      dimensions: 1,
      variables: 1
    },
    component: MapChart
  },
  {
    name: 'table',
    capabilities: {},
    component: TableChart
  }
]

export const CHARTS = indexBy(CHART_TYPES, 'name')
