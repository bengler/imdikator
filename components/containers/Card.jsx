import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import TabBar from '../elements/TabBar'
import FilterBarContainer from './FilterBarContainer'
import CardMetadata from './CardMetadata'
import ChartDescriptionContainer from './ChartDescriptionContainer'
import ShareWidget from './ShareWidget'
import ChartViewModeSelect from '../elements/ChartViewModeSelect'
import DownloadWidget from './DownloadWidget'
import {findHeaderGroupForQuery} from '../../lib/queryUtil'
import UrlQuery from '../../lib/UrlQuery'
import {queryResultPresenter} from '../../lib/queryResultPresenter'
import {trackCronologicalTabOpen, trackBenchmarkTabOpen} from '../../actions/tracking'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import html2canvas from 'html2canvas'
import { saveAs } from 'browser-filesaver'
import '../../node_modules/blueimp-canvas-to-blob/js/canvas-to-blob.min.js'

function downloadPNG(content, filename) {
  const blob = new Blob([content], { type: 'image/png' })
  saveAs(blob, filename)
}

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
      screenshot: null
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

  takeScreenshot () {
    // prevent text from overflowing screenshot
    const graphNumbers = document.querySelectorAll('.toggle-list__section.toggle-list__section--expanded .graph .chart .chart__svg .tick .chart__text--benchmark')
    graphNumbers.forEach(number => {
      number.style.fontSize = '12px'
    })

    html2canvas(this.toggleList, { useCORS: true }).then(canvas => {
      this.downloadCanvas(canvas, "bilde-fra-imdi-no.png")
    })
  }

  downloadCanvas (canvas, filename) {
    if (canvas.toBlob) {
      canvas.toBlob(
        function (blob) {
          downloadPNG(blob, filename)
        },
        'image/png'
      );
    }
  }

  render() {
    const { loading, card, activeTab, query, queryResult, region, headerGroups, printable } = this.props
    const { chartViewMode } = this.state

    if (!activeTab) {
      return (
        <div className="toggle-list__section toggle-list__section--expanded"><i className="loading-indicator" />
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
        ref={(toggleList) => this.toggleList = toggleList }
        crossorigin="anonymous"
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
          {data && <ChartComponent ref="chart" data={data} sortDirection={chartKind === 'benchmark' && 'ascending'} />}
        </div>

        <ChartDescriptionContainer
          query={query}
          region={region}
          card={card}
          headerGroups={headerGroups}
        />

        {!printable && (
          <div className="graph__functions">
            <ShareWidget chartUrl={this.getShareUrl()} />
            <DownloadWidget downloadScreenshot={this.takeScreenshot} region={region} query={query} headerGroups={headerGroups} />
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
