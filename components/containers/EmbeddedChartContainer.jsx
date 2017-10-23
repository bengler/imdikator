import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import ChartDescriptionContainer from './ChartDescriptionContainer'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import ChartViewModeSelect from '../elements/ChartViewModeSelect'
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
    queryResult: PropTypes.array,
    headerGroups: PropTypes.array,
    activeTab: PropTypes.object,
  };

  constructor(props) {
    super(props)
    this.state = {
      chartViewMode: 'chart'
    }
  }

  getChartKind() {
    const {activeTab} = this.props
    const {chartViewMode} = this.state
    return chartViewMode === 'table' ? 'table' : activeTab.chartKind
  }

  render() {
    const {cardsPage, card, activeTab, query, queryResult, region, headerGroups} = this.props
    const {chartViewMode} = this.state

    if (!activeTab) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded"><i className="loading-indicator" />
          Laster figur…
        </div>
      )
    }

    const chartKind = this.getChartKind()

    const chart = CHARTS[chartKind]
    const ChartComponent = chart.component

    if (!ChartComponent) {
      return (
        <div className="image-block">
          <div className="col-block-bleed">
            <div className="image-block__image image-block__image--figure">
              <p>Feil ved lasting av figur: {JSON.stringify(chartKind)}</p>
            </div>
          </div>
        </div>
      )
    }

    const data = queryResultPresenter(query, queryResult, {
      chartKind: chartKind,
      dimensions: card.config.dimensions
    })

    if (chart.name == 'benchmark') {
      data.highlight = {
        dimensionName: 'region',
        value: [region.prefixedCode]
      }
    }

    const chartUrl = `/tall-og-statistikk/steder/${region.prefixedCode}/${cardsPage.name}/${card.name}/${activeTab.name}`

    return (
      <figure className="image-block">
        <div className="col-block-bleed">
          <div className="image-block__image image-block__image--figure">
            <h3 className="h4">{card.title}</h3>
            <ChartViewModeSelect embedded mode={chartViewMode} onChange={newMode => this.setState({chartViewMode: newMode})} />
            {data && <ChartComponent data={data} sortDirection={chartKind === 'benchmark' && 'ascending'} />}
            <figcaption className="image-block__caption">
              <ChartDescriptionContainer
                query={query}
                region={region}
                card={card}
                headerGroups={headerGroups}
              />
            </figcaption>
            <a onClick={() => { sessionStorage.setItem('imdi-open-search-box-default', true) }} href={chartUrl} className="button button--secondary button--small t-no-margin">
              <i className="tabs-menu__icon  icon__chart-bars"></i>
              Finn tall for din kommune
            </a>
            <div className="image-block__figure-footer">
            </div>
          </div>
        </div>
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
    query
  }
}

export default connect(mapStateToProps)(EmbeddedChartContainer)
