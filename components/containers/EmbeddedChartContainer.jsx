import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import ChartDescriptionContainer from './ChartDescriptionContainer'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class EmbeddedChartContainer extends Component {
  static propTypes = {
    cardName: PropTypes.string.isRequired,
    cardsPageName: PropTypes.string.isRequired,
    tabName: PropTypes.string.isRequired,
    card: ImdiPropTypes.card,
    region: ImdiPropTypes.region,
    query: ImdiPropTypes.query,
    cardsPage: ImdiPropTypes.cardsPage,
    loading: PropTypes.boolean,
    data: PropTypes.object,
    headerGroups: PropTypes.array,
    activeTab: PropTypes.object,
  }

  getChartKind() {
    const {activeTab} = this.props
    return activeTab.chartKind
  }

  render() {
    const {card, data, query, region, headerGroups, loading} = this.props

    if (loading) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded">
          <i className="loading-indicator"/> Laster…
        </div>
      )
    }

    const chart = CHARTS[this.getChartKind()]
    const ChartComponent = chart.component

    if (!chart.component) {
      throw new Error(`Uh oh, missing chart component for ${chart.name}`)
    }

    const sortDirection = chart.name === 'benchmark' ? 'ascending' : null

    const chartData = Object.assign({}, data)
    if (chart.name == 'benchmark') {
      chartData.highlight = {
        dimensionName: 'region',
        value: [region.prefixedCode]
      }
    }

    return (
      <figure className="image-block">
        <div className="col-block-bleed">
          <div className="image-block__image">
            {data && <ChartComponent data={chartData} sortDirection={sortDirection}/>}
          </div>
        </div>
        <figcaption className="image-block__caption">
          <ChartDescriptionContainer
            query={query}
            region={region}
            card={card}
            headerGroups={headerGroups}
          />
        </figcaption>
      </figure>
    )
  }
}


function mapStateToProps(state, ownProps) {

  const cardState = (state.cardState[ownProps.regionCode] || {})[ownProps.cardName]

  if (!cardState || cardState.initializing) {
    return {loading: true}
  }

  // Find query from cardState.tabs[activeTab.name]
  const {activeTab, tabs} = cardState

  const tabState = tabs[activeTab.name]

  if (tabState.initializing) {
    return {loading: true}
  }

  const {loading, region, cardsPage, card, query, queryResult, headerGroups} = tabState
  return {
    loading,
    cardsPage,
    card,
    region,
    activeTab,
    headerGroups,
    queryResult: queryResult,
    data: !loading && queryResultPresenter(query, queryResult, {
      chartKind: activeTab.chartKind,
      dimensions: card.config.dimensions
    }),
    query
  }
}

export default connect(mapStateToProps)(EmbeddedChartContainer)
