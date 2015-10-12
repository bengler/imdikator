import BarChart from '../components/charts/bar-chart/BarChart'
import BenchmarkChart from '../components/charts/bar-chart/BenchmarkChart'
import StackedBarChart from '../components/charts/bar-chart/StackedBarChart'
import StackedAreaChart from '../components/charts/area-chart/StackedAreaChart'
import LineChart from '../components/charts/line-chart/LineChart'
import BubbleChart from '../components/charts/bubble-chart/BubbleChart'
import MapChart from '../components/charts/map-chart/MapChart'
import PyramidChart from '../components/charts/pyramid-chart/PyramidChart'
import TableChart from '../components/charts/table-chart/TableChart'

export const CHARTS = {
  stackedArea: {
    capabilities: {
      dimensions: 1
    },
    component: StackedAreaChart
  },
  line: {
    capabilities: {
      dimensions: 1
    },
    component: LineChart
  },
  bar: {
    capabilities: {
      dimensions: 2
    },
    component: BarChart
  },
  stackedBar: {
    capabilities: {
      dimensions: 2
    },
    component: StackedBarChart
  },
  pyramid: {
    capabilities: {
      dimensions: 3
    },
    component: PyramidChart
  },
  benchmark: {
    capabilities: {
      dimensions: 1,
      variables: 1
    },
    component: BenchmarkChart
  },
  bubble: {
    capabilities: {
      dimensions: 2
    },
    component: BubbleChart
  },
  map: {
    capabilities: {
      dimensions: 1,
      variables: 1
    },
    component: MapChart
  },
  table: {
    capabilities: {
    },
    component: TableChart
  }
}
