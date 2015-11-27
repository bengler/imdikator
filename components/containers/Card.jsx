import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import TabBar from '../elements/TabBar'
import FilterBarContainer from './FilterBarContainer'
import CardMetadata from '../elements/CardMetadata'
import ChartDescriptionContainer from './ChartDescriptionContainer'
import ShareWidget from './ShareWidget'
import ChartViewModeSelect from '../elements/ChartViewModeSelect'
import DownloadWidget from './DownloadWidget'
import {findHeaderGroupForQuery} from '../../lib/queryUtil'
import UrlQuery from '../../lib/UrlQuery'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class Card extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    card: ImdiPropTypes.card.isRequired,
    region: ImdiPropTypes.region.isRequired,
    query: PropTypes.object,
    queryResult: PropTypes.array,
    cardsPage: PropTypes.object,
    currentTabName: PropTypes.string,
    headerGroups: PropTypes.array,
    table: PropTypes.object,
    cardsPageName: PropTypes.string.isRequired,
    activeTab: PropTypes.object,
    printable: PropTypes.bool,
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func,
    navigate: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      chartViewMode: 'chart'
    }
  }


  getUrlToTab(tab) {
    return this.context.linkTo('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName/:tabName', {
      cardName: this.props.card.name,
      cardsPageName: this.props.cardsPageName,
      tabName: tab.urlName
    })
  }

  getHeaderGroupForQuery(query) {
    const {headerGroups} = this.props
    return findHeaderGroupForQuery(query, headerGroups)
  }

  handleFilterChange(newQuery) {
    return this.context.navigate(this.getUrlForQuery(newQuery), {replace: true, keepScrollPosition: true})
  }

  getChartKind() {
    const {activeTab} = this.props
    const {chartViewMode} = this.state
    return chartViewMode === 'table' ? 'table' : activeTab.chartKind
  }

  getUrlForQuery(query) {
    const {card, region, cardsPageName, activeTab} = this.props

    const params = {
      region: region.prefixedCode,
      cardName: card.name,
      cardsPageName: cardsPageName,
      tabName: activeTab.urlName,
      query: `@${UrlQuery.stringify(query)}`
    }
    return this.context.linkTo('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName/:tabName/:query', params)
  }

  getShareUrl() {
    const {query} = this.props
    const protocol = window.location.protocol
    const host = window.location.host
    const path = this.getUrlForQuery(query)
    return `${protocol}//${host}${path}`
  }

  render() {
    const {loading, card, activeTab, query, queryResult, region, headerGroups, printable} = this.props
    const {chartViewMode} = this.state

    if (!activeTab) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded"><i className="loading-indicator"/>
          Laster…
        </div>
      )
    }

    const headerGroup = this.getHeaderGroupForQuery(query)
    const disabledTabs = []
    if (headerGroup.aar.length < 2) {
      disabledTabs.push('chronological')
    }

    const chartKind = this.getChartKind()

    const chart = CHARTS[chartKind]
    const ChartComponent = chart.component

    if (!ChartComponent) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded">
          Error: No chart component for {JSON.stringify(chartKind)}
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

    return (
      <div
        className="toggle-list__section toggle-list__section--expanded"
        aria-hidden="false"
        style={{display: 'block'}}
      >

        {!printable && (
          <TabBar
            activeTab={activeTab}
            disabledTabs={disabledTabs}
            region={region}
            tabs={TABS}
            makeLinkToTab={tab => this.getUrlToTab(tab)}
          />
        )}

        {!printable && (
          <FilterBarContainer
            query={query}
            region={region}
            card={card}
            headerGroups={headerGroups}
            tab={activeTab}
            chart={CHARTS[activeTab.chartKind]}
            config={card.config}
            onChange={this.handleFilterChange.bind(this)}
          />
        )}

        {loading && <span><i className="loading-indicator"/> Laster…</span>}

        {!printable && (
          <ChartViewModeSelect
            mode={chartViewMode}
            onChange={newMode => this.setState({chartViewMode: newMode})}
          />
        )}

        <div className="graph">
          {data && <ChartComponent ref="chart" data={data} sortDirection={chartKind === 'benchmark' && 'ascending'}/>}
        </div>

        <ChartDescriptionContainer
          query={query}
          region={region}
          card={card}
          headerGroups={headerGroups}
        />

        {!printable && (
          <div className="graph__functions">
            <ShareWidget chartUrl={this.getShareUrl()}/>
            <DownloadWidget region={region} query={query} headerGroups={headerGroups}/>
          </div>
        )}

        {!printable && (
          <CardMetadata
            description={card.metadata.description}
            terminology={card.metadata.terminology}
            source={card.metadata.source}
            measuredAt={card.metadata.source}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {

  const cardState = (state.cardState[ownProps.region.prefixedCode] || {})[ownProps.card.name]

  if (!cardState || cardState.initializing) {
    return {loading: true}
  }

  // Find query from cardState.tabs[activeTab.name]
  const {activeTab, tabs} = cardState

  const tabState = tabs[activeTab.name]

  if (tabState.initializing) {
    return {loading: true}
  }

  const cardsPage = state.allCardsPages.find(cp => cp.name === ownProps.cardsPageName)

  const {loading, query, queryResult, headerGroups} = tabState
  return {
    loading,
    cardsPage,
    region: state.currentRegion,
    activeTab,
    headerGroups,
    allRegions: state.allRegions,
    queryResult: queryResult,
    query
  }
}

export default connect(mapStateToProps)(Card)
