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
    // access it by calling this.props.thisCard (from children)
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
    this.moveElementsIntoSVG = this.moveElementsIntoSVG.bind(this)
    this.addValuesToTransform = this.addValuesToTransform.bind(this)
    this.addDescriptionAndSourceBelowDiagram = this.addDescriptionAndSourceBelowDiagram.bind(this)
  }

  componentDidUpdate() {
    if (this.state.explicitView) {
      this.moveElementsIntoSVG() // add title and numbers above graph
    }

    this.addDescriptionAndSourceBelowDiagram()
  }

  addValuesToTransform(elements, addX, addY) {
    elements.forEach(element => {
      const transformValues = element.getAttribute('transform').split(',')

      const values = [transformValues[0].split('(')[1], transformValues[1].split(')')[0]]

      if (addX) values[0] = parseInt(values[0], 10) + addX
      if (addY) values[1] = parseInt(values[1], 10) + addY

      element.setAttribute('transform', `translate(${values[0].toString()}, ${values[1].toString()})`)
    })
  }

  //  this function is horrible and could break if some classname or other detail changes (e.g. h3 becomes h4)
  //  unfortunately the alternative is to refactor the architecture around d3
  //  (because d3 hijacks the 'this' keyword), which produces a tremendous amount of pains and would take crazy hours to fix.
  //  if the diagram is buggy or not behaving properly - inspect this function, it's probably the cause.
  moveElementsIntoSVG() {
    const svg = Array.prototype.slice.call(document.querySelectorAll('.chart__svg'))
    if (!svg) return

    //  extra height for the svg diagram
    const extraHeightDiagram = 80

    //  get all svg elements
    const chart = Array.prototype.slice.call(document.querySelectorAll('.chart__d3-points')) // converts NodeList to array
    const colorExplanation = Array.prototype.slice.call(document.querySelectorAll('.chart__legend-wrapper')) // convert NodeList to array

    //  returns the y axis transform value from all charts
    const currentChartHeight = chart.map(oneChart => {
      return oneChart.getAttribute('transform').split(',')
    })

    //  returns the y axis transform value from all color explanations
    const currentColorExplanationHeight = colorExplanation.map(oneColorExplanation => {
      return oneColorExplanation.getAttribute('transform').split(',')
    })

    //  creates an array with x and y axis transform value from chart
    const chartTransform = currentChartHeight.map(chartHeight => {
      return [
        chartHeight[0].split('(')[1],
        (parseInt(chartHeight[1].split(')')[0], 10) + extraHeightDiagram).toString()
      ]
    })

    //  creates an array with x and y axis transform value from color explanation
    const colorTransform = currentColorExplanationHeight.map(colorHeight => {
      return [
        colorHeight[0].split('(')[1],
        (parseInt(colorHeight[1].split(')')[0], 10) + extraHeightDiagram).toString()
      ]
    })

    //  reposition chart inside svg
    chart.forEach((chartItem, index) => {
      chartItem.setAttribute('transform', `translate(${chartTransform[index][0]}, ${chartTransform[index][1]})`)
    })

    //  reposition color explanation inside svg
    colorExplanation.forEach((colorItem, index) => {
      colorItem.setAttribute('transform', `translate(${colorTransform[index][0]}, ${colorTransform[index][1]})`)
    })

    //  add height and title for svg
    svg.forEach((svgItem, index) => {
      let title = svgItem.closest('.toggle-list')
      title = title.querySelector('a h3')

      const height = parseInt(svgItem.getAttribute('height'), 10) + extraHeightDiagram
      svgItem.setAttribute('height', height)


      //  adds title above diagam
      new SvgText({
        text: title.textContent,
        element: svgItem,
        maxWidth: svgItem.clientWidth || 0,
        textOverflow: 'ellipsis',
        className: 'svg-text title'
      })
    })
  }

  addDescriptionAndSourceBelowDiagram() {
    const svg = Array.prototype.slice.call(document.querySelectorAll('.chart__svg'))
    if (!svg) return

    //  extra height for the svg diagram
    const extraHeightSVG = 120
    const paddingBottom = 50
    const spaceBetween = 30

    //  add height and title for svg
    svg.forEach((svgItem, index) => {

      //  add extra height to svg
      const height = parseInt(svgItem.getAttribute('height'), 10) + extraHeightSVG
      svgItem.setAttribute('height', height)

      const parent = svgItem.closest('.toggle-list__section.toggle-list__section--expanded')
      const description = parent.querySelector('.graph__description')
      const source = parent.querySelector('.graph__about p')

      //  adds description below diagram
      new SvgText({
        text: description.textContent,
        element: svgItem,
        maxWidth: svgItem.clientWidth || 0,
        textOverflow: 'ellipsis',
        className: 'svg-text text__description',
        verticalAlign: 'bottom'
      })

      //  adds source below diagram
      new SvgText({
        text: source.textContent,
        element: svgItem,
        maxWidth: svgItem.clientWidth || 0,
        textOverflow: 'ellipsis',
        className: 'svg-text text__source',
        verticalAlign: 'bottom',
      })

      const textDescription = document.querySelectorAll('.text__description')
      const textSource = document.querySelectorAll('.text__source')

      this.addValuesToTransform(textDescription, null, svgItem.clientHeight - (spaceBetween + paddingBottom))
      this.addValuesToTransform(textSource, null, svgItem.clientHeight - paddingBottom)
    })
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
