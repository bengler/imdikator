import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'
import BarChart from '../charts/bar-chart/BarChart'
import {prefixifyRegion, getHeaderKey, countyNorway} from '../../lib/regionUtil'

const norway = countyNorway()

function queryKey(region, tableName) {
  return `${region.code}-${tableName}`
}

function share(value) {
  if (value == '.') {
    return 'Ukjent '
  }
  if (value == ':') {
    return 'Anonymisert '
  }
  return Number(value).toFixed(1)
}

function dispatchQueries(props) {
  const region = props.region
  const chartQuery = props.chartQuery
  const query = chartQuery.query
  const comparableRegionCodes = props.comparableRegionCodes

  const regionQuery = Object.assign({}, query, {region: prefixifyRegion(region)})
  if (chartQuery.compareRegionToSimilar && comparableRegionCodes.length > 0) {
    regionQuery.comparisonRegions = comparableRegionCodes
  }
  const regionQueryOptions = {
    region: region,
    chartKind: chartQuery.chartKind,
    queryKey: queryKey(region, query.tableName)
  }
  props.dispatch(loadChartData(regionQuery, regionQueryOptions))

  const norwayQuery = Object.assign({}, query, {region: prefixifyRegion(norway)})
  const norwayQueryOptions = {
    region: norway,
    chartKind: chartQuery.chartKind,
    queryKey: queryKey(norway, query.tableName)
  }
  props.dispatch(loadChartData(norwayQuery, norwayQueryOptions))
}


class RegionSummaryChart extends Component {

  static propTypes = {
    chartQuery: PropTypes.object,
    data: PropTypes.object,
    dispatch: PropTypes.func,
    region: PropTypes.object,
    similarRegionCodes: PropTypes.array
  }


  componentWillMount() {
    dispatchQueries(this.props)
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.region != this.props.region) {
      dispatchQueries(nextProps)
    }
  }


  render() {
    const region = this.props.region
    const chartQuery = this.props.chartQuery
    const tableName = chartQuery.query.tableName
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

    let titleParams = {
      share: share(data.rows[0].tabellvariabel)
    }
    chartQuery.additionalTitleParams.map(param => {
      titleParams[param] = data.rows[0][param]
    })
    const title = chartQuery.title(titleParams)
    const subtitle = chartQuery.subTitle({share: share(comparisonData.rows[0].tabellvariabel)})


    // secondary titles, atm only used in barchart
    let titleTwo = null
    let subtitleTwo = null
    if (chartQuery.chartKind == 'bar') {
      titleParams = {
        share: share(data.rows[1].tabellvariabel)
      }
      chartQuery.additionalTitleParams.map(param => {
        titleParams[param] = data.rows[1][param]
      })
      titleTwo = chartQuery.title(titleParams)
      subtitleTwo = chartQuery.subTitle({share: share(comparisonData.rows[1].tabellvariabel)})
    }


    const Chart = chartQuery.chartKind == 'benchmark' ? BenchmarkChart : BarChart
    // BenchmarkChart can only handle one dimension
    const dimensions = chartQuery.chartKind == 'benchmark' ? ['region'] : ['innvkat3', 'region']

    const modifiedData = update(data, {
      dimensions: {$set: dimensions},
      // highlight our current region
      highlight: {$set: {
        dimensionName: 'region',
        value: [prefixifyRegion(region)]
      }}
    })

    return (
      <div className="col--third col--flow">
        <section className="indicator">
          {title && <h3 className="indicator__primary">{title}</h3>}
          {subtitle && <p className="indicator__secondary">{subtitle}</p>}
          {titleTwo && <h3 className="indicator__primary">{titleTwo}</h3>}
          {subtitleTwo && <p className="indicator__secondary">{subtitleTwo}</p>}
          <div className="indicator__graph">
            <Chart data={modifiedData} className="summaryChart" sortDirection="ascending"/>
          </div>
        </section>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const tableName = ownProps.chartQuery.query.tableName
  const regionKey = queryKey(ownProps.region, tableName)
  const norwayKey = queryKey(norway, tableName)
  const chartData = {}
  if (state.chartData[regionKey]) {
    chartData[regionKey] = state.chartData[regionKey]
  }
  if (state.chartData[norwayKey]) {
    chartData[norwayKey] = state.chartData[norwayKey]
  }

  return {
    data: chartData
  }
}

export default connect(mapStateToProps)(RegionSummaryChart)
