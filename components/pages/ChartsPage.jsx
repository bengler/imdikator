import React, {Component, PropTypes} from 'react'
import BarChart from '../charts/bar-chart/BarChart'
import GlanceBarChart from '../charts/bar-chart/GlanceBarChart'
import AreaChart from '../charts/area-chart/AreaChart'

const CHARTS = {
  bar: BarChart,
  area: AreaChart,
  glance: GlanceBarChart
}


export default class ChartsPage extends Component {
  static propTypes = {
    route: PropTypes.object
  }

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
