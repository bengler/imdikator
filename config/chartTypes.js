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
  stackedArea: StackedAreaChart,
  line: LineChart,
  bar: BarChart,
  stackedBar: StackedBarChart,
  pyramid: PyramidChart,
  benchmark: BenchmarkChart,
  bubble: BubbleChart,
  map: MapChart,
  table: TableChart,
}
