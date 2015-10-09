import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'
import {prefixify, getHeaderKey, countyNorway} from '../../lib/regionUtil'


function queryKey(region, tableName) {
  return `${region.code}-${tableName}`
}

const norway = countyNorway()

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
    const query = this.props.chartQuery.query

    const regionQuery = Object.assign({}, query, {region: prefixify(region)})
    const regionQueryOptions = {
      region: region,
      chartKind: 'benchmark',
      queryKey: queryKey(region, query.tableName)
    }
    this.props.dispatch(loadChartData(regionQuery, regionQueryOptions))

    const norwayQuery = Object.assign({}, query, {region: prefixify(norway)})
    const norwayQueryOptions = {
      region: norway,
      chartKind: 'benchmark',
      queryKey: queryKey(norway, query.tableName)
    }
    this.props.dispatch(loadChartData(norwayQuery, norwayQueryOptions))
  }


  render() {
    const region = this.props.region
    const tableName = this.props.chartQuery.query.tableName
    const data = this.props.data[queryKey(region, tableName)]
    const comparisonData = this.props.data[queryKey(norway, tableName)]

    if (!(data && data.rows[0] && comparisonData)) {
      return (
        <div className="col--third col--flow">
          <section className="indicator">
            <div className="indicator__graph">
              <pre>Ingen data å for {tableName}</pre>
            </div>
          </section>
        </div>
      )
    }
    const chartQuery = this.props.chartQuery

    const titleParams = {
      share: Number(data.rows[0].tabellvariabel).toFixed(1)
    }
    chartQuery.additionalTitleParams.map(param => {
      titleParams[param] = data.rows[0][param]
    })
    const title = chartQuery.title(titleParams)
    const subTitle = chartQuery.subTitle({share: Number(comparisonData.rows[0].tabellvariabel).toFixed(1)})

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
