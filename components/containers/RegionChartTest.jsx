import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'


class RegionChartTest extends Component {

  static propTypes = {
    regionCode: PropTypes.string,
    chartData: PropTypes.object,
    dispatch: PropTypes.func
  }


  componentWillMount() {
    this.props.dispatch(loadChartData(this.props.regionCode, 'pie-chart-yum-yum'))
  }


  render() {
    const chartData = this.props.chartData
    if (!chartData) {
      return (
        <div className="col--main">
          <span>Loading data...</span>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </div>
      )
    }
    return (
      <div className="col--main">
        <BenchmarkChart data={chartData}/>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    chartData: state.chartData
  }
}

export default connect(mapStateToProps)(RegionChartTest)
