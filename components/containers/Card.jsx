import React, {Component, PropTypes} from 'react'

import {connect} from 'react-redux'
import d3_save_svg from 'd3-save-svg'
import SvgText from 'svg-text'

import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import {findHeaderGroupForQuery} from '../../lib/queryUtil'
import UrlQuery from '../../lib/UrlQuery'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import TabBar from '../elements/TabBar'
import ToggleView from '../elements/ToggleView'
import ChartViewModeSelect from '../elements/ChartViewModeSelect'

import {queryToOptions, describeChart} from '../../lib/chartDescriber'
import {getHeaderKey} from '../../lib/regionUtil'

import FilterBarContainer from './FilterBarContainer'
import CardMetadata from './CardMetadata'
import ChartDescriptionContainer from './ChartDescriptionContainer'
import ShareWidget from './ShareWidget'
import DownloadWidget from './DownloadWidget'

import {trackCronologicalTabOpen, trackBenchmarkTabOpen} from '../../actions/tracking'
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
    description: PropTypes.string,
    printView: PropTypes.bool,
    
    // really confusing; thisCard is 'this' for this class (Card).
    // access it by calling this.props.thisCard.
    // why? Because d3 hijacks 'this' in child scope after mount.
    // so if we want to use 'this' for Card, we must use this.props.thisCard (in child components)
    thisCard: PropTypes.any
  };

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func,
    navigate: PropTypes.func
  };

  constructor(props) {
    super()
    this.state = {
      chartViewMode: 'chart',
      screenshot: null,
      explicitView: false,
      description: null,
      printView: false
    }

    this.getUrlToTab = this.getUrlToTab.bind(this)
    this.getShareUrl = this.getShareUrl.bind(this)
  }

  getUrlToTab(tab) {
    return this.context.linkTo('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName/:tabName', {
      cardName: this.props.card.name,
      cardsPageName: this.props.cardsPageName,
      tabName: tab.urlName
    })
  }

  onTabLinkClick(tab) {
    switch (tab.name) {
      case 'chronological':
        this.props.dispatch(trackCronologicalTabOpen())
        break
      case 'benchmark':
        this.props.dispatch(trackBenchmarkTabOpen())
        break
      default:
        break
    }
  }

  getHeaderGroupForQuery(query) {
    const {headerGroups} = this.props
    return findHeaderGroupForQuery(query, headerGroups)
  }

  handleFilterChange(newQuery) {
    const newQ = this.getUrlForQuery(newQuery)
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

  takeScreenshot() {
    const graphNumbers = document.querySelectorAll('.toggle-list__section.toggle-list__section--expanded .graph .chart .chart__svg .tick .chart__text--benchmark')
    graphNumbers.forEach(number => {
      number.style.fontSize = '12px'
    })

    const config = {
      filename: 'imdi-diagram',
    }

    // // SETUP
    // // insert details into SVG
    // const text = new SvgText({
    //   text: 'Figuren viser antall personer fordelt etter bakgrunn i 2017 i Norge.',
    //   element: document.querySelector('.chart__svg'),
    //   maxWidth: 100,
    //   textOverflow: 'ellipsis'
    // })

    // // STYLE construct
    // // give some space for the new text and position it at the bottom
    // const chart = document.querySelector('.chart__svg')
    // document.querySelector('text.svg-text.svg-text-0').style.transform = 'translateY(500px)'
    // document.querySelector('.chart__svg').style.margin = '50px 0px 150px 0px'
    // chart.height = chart.height + 200
    // console.log(chart.height)
    // // DESCTRUCT
    // // remove styling applied above
    // // let textElement = document.createElement('text')
    // // textElement.setAttribute('height', 40)
    // // textElement.setAttribute('width', 400)
    // // textElement.setAttribute('x', 0)
    // // textElement.setAttribute('viewBox', '0 0 400 40"')
    // // textElement.setAttribute('y', -25)
    // // textElement.innerHTML = 'something'
    // // chart.insertBefore(textElement, firstChildOfChart)

    const svg = document.querySelector('.chart__svg')
    d3_save_svg.save(svg, config) // eslint-disable-line
  }

  render() {
    const {loading, card, activeTab, query, queryResult, region, headerGroups, printable, description} = this.props
    const {chartViewMode, explicitView} = this.state

    if (!activeTab) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded"><i className="loading-indicator" />
          Laster…
        </div>
      )
    }

    // headerGroup links query from cardPages.json to the actual data that will be shown.
    const headerGroup = this.getHeaderGroupForQuery(query)

    const disabledTabs = []
    if (headerGroup.aar.length < 2) {
      disabledTabs.push('chronological')
    }

    const chartKind = this.getChartKind()

    const chart = CHARTS[chartKind]
    const ChartComponent = chart.component
    const showExternalLinkBosatte = this.props.card.name == 'bosatt_anmodede' // TODO: Needs to be dynamic

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
      <section
        className="toggle-list__section toggle-list__section--expanded"
        aria-hidden="false"
        style={{display: 'block'}}
        ref={(toggleList) => { this.toggleList = toggleList }}
        crossOrigin="anonymous"
      >

        {!printable && (
          <TabBar
            activeTab={activeTab}
            disabledTabs={disabledTabs}
            region={region}
            tabs={TABS}
            handleTabLinkClick={this.onTabLinkClick.bind(this)}
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

        {loading && <span><i className="loading-indicator" /> Laster…</span>}

        {!printable && (
          <ChartViewModeSelect
            mode={chartViewMode}
            onChange={newMode => this.setState({chartViewMode: newMode})}
          />
        )}

        <div className="graph">
          {data && (
            <ChartComponent
              ref="chart"
              data={data}
              explicitView={explicitView}
              title={card.title}
              source={card.metadata.source}
              measuredAt={card.metadata.measuredAt}
              printView={this.state.printView}
              thisCard={this}
              description={description}
              sortDirection={chartKind === 'benchmark' && 'ascending'}
            />
          )}
        </div>

        <div className="graph__description">
          {this.props.description}
        </div>

        {!printable && (
          <div className="graph__functions">
            {chart.name === 'bar' && <ToggleView explicitView={explicitView} setExplicitView={isExplicit => this.setState({explicitView: isExplicit})} />}
            <ShareWidget chartUrl={this.getShareUrl()} />
            <DownloadWidget downloadScreenshot={this.takeScreenshot} region={region} query={query} headerGroups={headerGroups} setExplicitView={isExplicit => this.setState({explicitView: isExplicit})} />
          </div>
        )}

        {!printable && (
          <CardMetadata dimensions={query.dimensions} metadata={card.metadata} />
        )}
        {showExternalLinkBosatte && (
          <div className="graph__related">
            <div className="cta cta--simple">
              <h4 className="cta__title">Se også</h4>
              <ul>
                <li><a href="/planlegging-og-bosetting/anmodning-og-vedtak/">
                Anmodnings- og vedtakstall for bosetting av flyktninger</a></li>
              </ul>
            </div>
          </div>
        )}
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {

  const cardState = (state.cardState[ownProps.region.prefixedCode] || {})[ownProps.card.name]
  if (!cardState || cardState.initializing) {
    return {loading: true}
  }
  const {region, card} = ownProps
  // Find query from cardState.tabs[activeTab.name]
  const {activeTab, tabs} = cardState

  const tabState = tabs[activeTab.name]

  if (tabState.initializing) {
    return {loading: true}
  }

  const cardsPage = state.allCardsPages.find(cp => cp.name === ownProps.cardsPageName)

  const {loading, query, queryResult, headerGroups} = tabState

  const {allRegions} = state
  const regionHeaderKey = getHeaderKey(region)
  const headerGroup = headerGroups.find(group => {
    return group.hasOwnProperty(regionHeaderKey) && query.dimensions.every(dim => group.hasOwnProperty(dim.name))
  })

  const graphDescription = describeChart(queryToOptions(query, card, headerGroup, allRegions))

  return {
    loading,
    cardsPage,
    region: state.currentRegion,
    activeTab,
    headerGroups,
    allRegions: state.allRegions,
    queryResult: queryResult,
    query,
    description: graphDescription
  }
}

export default connect(mapStateToProps)(Card)
