import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'


class RegionChartTest extends Component {

  static propTypes = {
    query: PropTypes.object,
    data: PropTypes.object,
    dispatch: PropTypes.func,
    region: PropTypes.object
  }


  componentWillMount() {
    this.props.dispatch(loadChartData(this.props.region, this.props.query, 'benchmark'))
  }


  render() {
    const data = this.props.data
    const tableName = this.props.query.tableName
    if (!data) {
      return (
        <div className="col--main">
          <span>Loading data...</span>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </div>
      )
    }
    return (
      <div className="col--main">
        <BenchmarkChart data={data[tableName]}/>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    data: state.chartData
  }
}

export default connect(mapStateToProps)(RegionChartTest)
