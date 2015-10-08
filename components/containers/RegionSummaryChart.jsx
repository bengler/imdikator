import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'
import {prefixify, getHeaderKey} from '../../lib/regionUtil'


class RegionSummaryChart extends Component {

  static propTypes = {
    chartQuery: PropTypes.object,
    data: PropTypes.object,
    dispatch: PropTypes.func,
    region: PropTypes.object,
    similarRegions: PropTypes.array
  }


  componentWillMount() {
    const region = this.props.region
    const query = Object.assign({}, this.props.chartQuery.query, {region: prefixify(region)})
    this.props.dispatch(loadChartData(region, query, 'benchmark'))
  }


  render() {
    const tableName = this.props.chartQuery.query.tableName
    const data = this.props.data[tableName]

    if (!data || !data.rows[0]) {
      return (
        <div className="col--third col--flow">
          <section className="indicator">
            <div className="indicator__graph">
              <pre>Ingen data å for {tableName} :(</pre>
            </div>
          </section>
        </div>
      )
    }
    const region = this.props.region
    const chartQuery = this.props.chartQuery
    const title = chartQuery.title(Number(data.rows[0].tabellvariabel).toFixed(1))
    const subTitle = chartQuery.subTitle('todo')

    // overwrite dimensions because BenchmarkChart can only handle one dimension
    const modifiedData = update(data, {
      dimensions: {$set: [getHeaderKey(region)]}
    })

    return (
      <div className="col--third col--flow">
        <section className="indicator">
          <h3 className="indicator__primary">{title}</h3>
          <p className="indicator__secondary">{subTitle}</p>
          <div className="indicator__graph">
            <BenchmarkChart data={modifiedData} className="summaryChart"/>
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
