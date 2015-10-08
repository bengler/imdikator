import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'


class RegionSummaryChart extends Component {

  static propTypes = {
    chartQuery: PropTypes.object,
    data: PropTypes.object,
    dispatch: PropTypes.func,
    region: PropTypes.object
  }


  componentWillMount() {
    this.props.dispatch(loadChartData(this.props.region, this.props.chartQuery.query, 'benchmark'))
  }


  render() {
    const tableName = this.props.chartQuery.query.tableName
    const data = this.props.data[tableName]
    const chartQuery = this.props.chartQuery
    if (!data) {
      return (
        <div className="indicator__graph">
          <span>Ingen data å finne...</span>
        </div>
      )
    }
    return (
      <div className="col--third col--flow">
        <section className="indicator">
          <h3 className="indicator__primary">{chartQuery.title('12%')}</h3>
          <p className="indicator__secondary">{chartQuery.subTitle('5%')}</p>
          <div className="indicator__graph">
            <BenchmarkChart data={data} className="summaryChart"/>
          </div>
        </section>
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
