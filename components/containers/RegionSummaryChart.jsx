import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {loadChartData} from '../../actions/chartFodder'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'
import BarChart from '../charts/bar-chart/BarChart'
import {norway} from '../../lib/regionUtil'
import {unitFormatter} from '../../lib/unitFormatter'
import {_t} from '../../lib/translate'

function queryKey(region, tableName) {
  return `${region.prefixedCode}-${tableName}`
}

function share(value) {
  if (value == '.') {
    return 'ukjent '
  }
  if (value == ':') {
    return 'Anonymisert '
  }
  return value
  //return Number(value).toFixed(1)
}


function dispatchQueries(props) {
  const region = props.region
  const chartQuery = props.chartQuery
  const query = chartQuery.query
  const comparableRegionCodes = props.comparableRegionCodes
  const isNotNorway = region.prefixedCode != norway.prefixedCode

  const regionQuery = Object.assign({}, query, {region: region.prefixedCode})

  if (chartQuery.compareRegionToSimilar && comparableRegionCodes.length > 0) {
    regionQuery.comparisonRegions = comparableRegionCodes
  }
  const regionQueryOptions = {
    region: region,
    chartKind: chartQuery.chartKind,
    queryKey: queryKey(region, query.tableName)
  }
  props.dispatch(loadChartData(regionQuery, regionQueryOptions))

  if (isNotNorway) {
    const norwayQuery = Object.assign({}, query, {region: norway.prefixedCode})
    const norwayQueryOptions = {
      region: norway,
      chartKind: chartQuery.chartKind,
      queryKey: queryKey(norway, query.tableName)
    }
    props.dispatch(loadChartData(norwayQuery, norwayQueryOptions))
  }
}


class RegionSummaryChart extends Component {

  static propTypes = {
    chartQuery: PropTypes.object,
    data: PropTypes.object,
    dispatch: PropTypes.func,
    region: PropTypes.object,
    comparableRegionCodes: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    dispatchQueries(this.props)
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.region != this.props.region) {
      // only dispatch new queries if the region has changed
      dispatchQueries(nextProps)
    }
  }


  render() {
    const region = this.props.region
    const chartQuery = this.props.chartQuery
    const tableName = chartQuery.query.tableName
    const data = this.props.data[queryKey(region, tableName)]
    const comparisonData = this.props.data[queryKey(norway, tableName)]
    const isNotNorway = region.prefixedCode != norway.prefixedCode

    if (!(data && data.rows[0] && comparisonData)) {
      return null
    }
    const formatter = unitFormatter(chartQuery.query.unit)
    const regionDataRow = data.rows.find(row => row.region == region.prefixedCode)
    let titleParams = {
      share: formatter.format(share(regionDataRow.tabellvariabel))
    }
    chartQuery.additionalTitleParams.map(param => {
      titleParams[param] = regionDataRow[param]
    })
    const title = chartQuery.title(titleParams)
    const subtitle = isNotNorway ? chartQuery.subTitle({share: formatter.format(share(comparisonData.rows[0].tabellvariabel))}) : null

    // secondary titles, atm only used in barchart
    let titleTwo = null
    let subtitleTwo = null
    if (chartQuery.chartKind == 'bar') {
      titleParams = {
        share: formatter.format(share(data.rows[1].tabellvariabel))
      }
      chartQuery.additionalTitleParams.map(param => {
        titleParams[param] = data.rows[1][param]
      })
      titleTwo = chartQuery.title(titleParams)
      subtitleTwo = chartQuery.subTitle({share: formatter.format(share(comparisonData.rows[1].tabellvariabel))})
    }


    const Chart = chartQuery.chartKind == 'benchmark' ? BenchmarkChart : BarChart
    // BenchmarkChart can only handle one dimension
    const dimensions = chartQuery.chartKind == 'benchmark' ? ['region'] : ['region', 'innvkat3']

    const modifiedData = update(data, {
      dimensions: {$set: dimensions},
      // highlight our current region
      highlight: {$set: {
        dimensionName: 'region',
        value: [region.prefixedCode]
      }}
    })
    const drillDownUrl = this.context.linkTo('/steder/:region/:pageName/:cardName', {
      region: region.prefixedCode,
      pageName: chartQuery.drillDown.page,
      cardName: chartQuery.drillDown.card
    })
    const similarUrl = this.context.linkTo('/steder/:region/ligner', {region: region.prefixedCode})

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
          {isNotNorway
            && <p className="indicator__subtext">
              {region.name} og <a href={similarUrl}>lignende {_t(`several-${region.type}`)}</a>
            </p>
          }
          <a href={drillDownUrl} className="button button--secondary indicator__cta">{chartQuery.drillDown.buttonTitle}</a>
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
