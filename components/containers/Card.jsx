import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import TabBar from '../elements/TabBar'
import FilterBarContainer from './FilterBarContainer'
import CardMetadata from '../elements/CardMetadata'
import ChartDescriptionContainer from './ChartDescriptionContainer'
import ShareWidget from './ShareWidget'
import DownloadWidget from './DownloadWidget'
import {findHeaderGroupForQuery} from '../../lib/queryUtil'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import Clipboard from 'clipboard'
import config from '../../config'
import {performQuery} from '../../actions/cardsPage'

class Card extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    card: ImdiPropTypes.card.isRequired,
    region: ImdiPropTypes.region.isRequired,
    query: PropTypes.object,
    cardsPage: PropTypes.object,
    currentTabName: PropTypes.string,
    data: PropTypes.object,
    headerGroups: PropTypes.array,
    table: PropTypes.object,
    cardsPageName: PropTypes.string.isRequired,
    activeTab: PropTypes.object,
    printable: PropTypes.bool,
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      showTable: false
    }
  }

  makeLinkToTab(tab) {
    return this.context.linkTo('/indikator/steder/:region/:cardsPageName/:cardName/:tabName', {
      cardName: this.props.card.name,
      cardsPageName: this.props.cardsPageName,
      tabName: tab.name
    })
  }

  getHeaderGroupForQuery(query) {
    const {headerGroups} = this.props
    return findHeaderGroupForQuery(query, headerGroups)
  }

  handleFilterChange(newQuery) {
    const {region, cardsPage, card, activeTab, dispatch} = this.props
    dispatch(performQuery({region, cardsPage: cardsPage, card: card, tab: activeTab, query: newQuery}))
  }


  handleTableToggle(event) {
    event.preventDefault()
    this.setState({showTable: !this.state.showTable})
  }

  getChartKind() {
    const {activeTab} = this.props
    return activeTab.chartKind
  }

  chartUrl() {
    const route = '/indikator/steder/:region/:cardsPageName/:cardName/:tabName'
    const routeOpts = {
      cardName: this.props.card.name,
      tabName: this.props.activeTab.name,
      cardsPageName: this.props.cardsPageName
    }
    const host = window.location.hostname
    const port = `:${window.location.port}`
    const path = this.context.linkTo(route, routeOpts)
    return `${host}${config.env == 'development' ? port : ''}${path}`
  }


  tableFriendlyData(data, query, tabName) {
    let tableData = Object.assign({}, data)
    if (tableData.dimensions && !tableData.dimensions.includes('region')) {
      const dimensions = tableData.dimensions.slice()
      dimensions.unshift('region')
      dimensions.push('enhet')
      tableData = Object.assign({}, tableData, {dimensions: dimensions})
    }
    if (tabName == 'benchmark') {
      const dimensions = query.dimensions.slice().map(dim => dim.name)
      dimensions.unshift('region')
      dimensions.push('enhet')
      tableData = Object.assign({}, tableData, {dimensions: dimensions})
    }
    return tableData
  }


  render() {
    const {loading, card, data, activeTab, query, region, headerGroups, printable} = this.props

    if (!activeTab) {
      return <div className="toggle-list__section toggle-list__section--expanded"><i className="loading-indicator"/> Laster…</div>
    }
    const showTable = this.state.showTable
    const headerGroup = this.getHeaderGroupForQuery(query)
    const disabledTabs = []
    if (headerGroup.aar.length < 2) {
      disabledTabs.push('chronological')
    }

    const chart = CHARTS[this.getChartKind()]
    const ChartComponent = showTable ? CHARTS.table.component : chart.component

    if (!chart.component) {
      throw new Error(`Uh oh, missing chart component for ${chart.name}`)
    }

    const sortDirection = activeTab.name === 'benchmark' ? 'ascending' : null

    let chartData = Object.assign({}, data)
    if (activeTab.name == 'benchmark') {
      chartData.highlight = {
        dimensionName: 'region',
        value: [region.prefixedCode]
      }
    }

    if (showTable) {
      chartData = this.tableFriendlyData(chartData, query, activeTab.name)
    }

    const clipboard = new Clipboard('.clipboardButton') // eslint-disable-line no-unused-vars

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
          makeLinkToTab={tab => this.makeLinkToTab(tab)}
        />
        )}

        {!printable && (
        <FilterBarContainer
          query={query}
          region={region}
          card={card}
          headerGroups={headerGroups}
          tab={activeTab}
          chart={chart}
          config={card.config}
          onChange={this.handleFilterChange.bind(this)}
        />
        )}

        {loading && <span><i className="loading-indicator"/> Laster…</span>}

        {!printable && (
        <div className="graph__types">
          <ul className="tabs-mini">
            <li className="tabs-mini__item">
              {showTable && (
              <a href="#" className="tabs-mini__link tabs-mini__link--current" onClick={this.handleTableToggle.bind(this)}>Figur</a>
              )}
              {!showTable && (
              <span className="tabs-mini__link tabs-mini__link--current">Figur</span>
              )}
            </li>
            <li className="tabs-mini__item">
              {showTable && (
              <span className="tabs-mini__link tabs-mini__link--current">Tabell</span>
              )}
              {!showTable && (
              <a href="#" className="tabs-mini__link tabs-mini__link--current" onClick={this.handleTableToggle.bind(this)}>Tabell</a>
              )}
            </li>
          </ul>
        </div>
        )}

        <div className="graph">
          {data && <ChartComponent data={chartData} sortDirection={sortDirection}/>}
        </div>
        <ChartDescriptionContainer
          query={query}
          region={region}
          card={card}
          headerGroups={headerGroups}
        />
        {!printable && (
        <div className="graph__functions">
          <ShareWidget chartUrl={this.chartUrl()}/>
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

  if (cardState.initializing) {
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
    data: !loading && queryResultPresenter(query, queryResult, {
      chartKind: activeTab.chartKind,
      dimensions: ownProps.card.config.dimensions
    }),
    query
  }
}

export default connect(mapStateToProps)(Card)
