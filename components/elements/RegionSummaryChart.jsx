import React, {Component, PropTypes} from 'react'
import update from 'react-addons-update'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'
import BarChart from '../charts/bar-chart/BarChart'
import {norway, comparisonDescription} from '../../lib/regionUtil'
import {unitFormatter} from '../../lib/unitFormatter'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

export default class RegionSummaryChart extends Component {

  static propTypes = {
    region: ImdiPropTypes.region.isRequired,
    query: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    queryResult: PropTypes.array.isRequired,
    compareWith: PropTypes.shape({
      queryResult: PropTypes.array
    })
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  render() {

    const {region, queryResult, query, config, compareWith} = this.props

    const data = queryResult && queryResultPresenter(query, queryResult, {chartKind: config.chartKind})
    const comparisonData = compareWith && compareWith.queryResult

    const isNorway = region.prefixedCode === norway.prefixedCode

    const formatter = unitFormatter(query.unit[0])

    const regionDataRow = data.rows.find(row => row.region == region.prefixedCode)

    let titleParams = {
      share: formatter.format(regionDataRow.value)
    }

    config.additionalTitleParams.map(param => {
      titleParams[param] = regionDataRow[param]
    })

    const title = config.title(titleParams)
    const subtitle = comparisonData && config.subTitle({share: formatter.format(comparisonData[0].tabellvariabel)})

    // secondary titles, atm only used in barchart
    let titleTwo = null
    let subtitleTwo = null
    if (config.chartKind == 'bar') {
      titleParams = {
        share: formatter.format(data.rows[1].value)
      }
      config.additionalTitleParams.map(param => {
        titleParams[param] = data.rows[1][param]
      })
      titleTwo = config.title(titleParams)
      subtitleTwo = comparisonData && config.subTitle({share: formatter.format(comparisonData[1].tabellvariabel)})
    }

    const Chart = config.chartKind == 'benchmark' ? BenchmarkChart : BarChart
    // BenchmarkChart can only handle one dimension
    const dimensions = config.chartKind == 'benchmark' ? ['region'] : ['region', 'innvkat3']

    const modifiedData = update(data, {
      dimensions: {$set: dimensions},
      // highlight our current region
      highlight: {
        $set: {
          dimensionName: 'region',
          value: [region.prefixedCode]
        }
      }
    })

    const drillDownUrl = this.context.linkTo('/indikator/steder/:region/:cardsPageName/:cardName', {
      region: region.prefixedCode,
      cardsPageName: config.drillDown.page,
      cardName: config.drillDown.card
    })

    const similarUrl = this.context.linkTo('/indikator/steder/:region/lignende', {region: region.prefixedCode})
    const comparison = comparisonDescription(region).toLowerCase()

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
          {!isNorway && (
          <p className="indicator__subtext">
            {region.name} og <a href={similarUrl}>{comparison}</a>
          </p>
            )}
          <a href={drillDownUrl} className="button button--secondary indicator__cta">{config.drillDown.buttonTitle}</a>
        </section>
      </div>
    )
  }
}
