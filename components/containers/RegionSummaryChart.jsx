import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'


class RegionSummaryChart extends Component {

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
    const tableName = this.props.query.tableName
    const data = this.props.data[tableName]
    if (!data) {
      return (
        <div className="indicator__graph">
          <span>Ingen data å finne...</span>
        </div>
      )
    }
    return (
      <div className="indicator__graph">
        <BenchmarkChart data={data} className="summaryChart"/>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    data: state.chartData
  }
}

export default connect(mapStateToProps)(RegionSummaryChart)
