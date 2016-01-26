import React, {Component, PropTypes} from 'react'
import BarChart from '../charts/bar-chart/BarChart'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'
import StackedBarChart from '../charts/bar-chart/StackedBarChart'
import StackedAreaChart from '../charts/area-chart/StackedAreaChart'
import LineChart from '../charts/line-chart/LineChart'
import BubbleChart from '../charts/bubble-chart/BubbleChart'
import MapChart from '../charts/map-chart/MapChart'
import PyramidChart from '../charts/pyramid-chart/PyramidChart'
import TableChart from '../charts/table-chart/TableChart'

const CHARTS = {
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


export default class ChartsPage extends Component {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const {route} = this.props
    const ChartComponent = CHARTS[route.params.chart]
    const charts = Object.keys(CHARTS)

    const chartsLinks = charts.map(chart => <a style={{padding: 10}} key={chart} href={chart}>{chart}</a>)

    if (!ChartComponent) {
      return <div>No such chart. Select one of {chartsLinks}</div>
    }
    return (
      <div>
        <p><a href="/">Go home!</a></p>
        <p>{chartsLinks}</p>
        <ChartComponent/>
      </div>
    )
  }
}
