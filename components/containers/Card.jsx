import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import TabBar from '../elements/TabBar'
import FilterBar from './FilterBar'
import debug from '../../lib/debug'
import CardMetadata from '../elements/CardMetadata'
import DownloadWidget from './DownloadWidget'
import {constrainQuery, getQuerySpec} from '../../lib/querySpec'
import {performQuery} from '../../actions/cardPages'
import {loadAllRegions} from '../../actions/region'
import {queryToOptions, describeChart} from '../../lib/chartDescriber'
import {isSimilarRegion, getHeaderKey} from '../../lib/regionUtil'
import Clipboard from 'clipboard'
import config from '../../config'


class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    pageName: PropTypes.string,
    region: PropTypes.object,
    query: PropTypes.object,
    data: PropTypes.object,
    headerGroup: PropTypes.object,
    table: PropTypes.object,
    activeTab: PropTypes.object,
    boundUpdateCardQuery: PropTypes.func,
    dispatch: PropTypes.func,
    showTable: PropTypes.bool,
    allRegions: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      isRegionSelectOpen: false,
      showTable: false
    }
  }


  componentWillMount() {
    this.props.dispatch(loadAllRegions())
  }

  makeLinkToTab(tab) {
    return this.context.linkTo('/steder/:region/:pageName/:cardName/:tabName', {
      cardName: this.props.card.name,
      pageName: this.props.pageName,
      tabName: tab.name
    })
  }

  handleFilterChange(property, newValue) {
    const {card, activeTab, query} = this.props

    let newQuery
    if (['comparisonRegions', 'unit', 'year'].includes(property)) {
      newQuery = Object.assign({}, query, {
        [property]: newValue
      })
    } else {
      newQuery = update(query, {
        dimensions: {
          $apply: dimensions => {
            return dimensions.map(dim => {
              if (dim.name !== property) {
                return dim
              }
              return Object.assign({}, dim, {
                variables: Array.isArray(newValue) ? newValue : [newValue]
              })
            })
          }
        }
      })
    }
    const constrainedQuery = constrainQuery(newQuery, this.getQuerySpec(newQuery))
    constrainedQuery.operations.forEach(op => {
      debug('%s: %s', op.dimension, op.description)
    })
    this.props.dispatch(performQuery(card, activeTab, constrainedQuery.query))
  }

  handleTableToggle(event) {
    event.preventDefault()
    this.setState({showTable: !this.state.showTable})
  }


  getChartKind() {
    const {activeTab} = this.props
    return activeTab.chartKind
  }

  // TODO: Maybe investigate a wrapper around query/querySpec
  // const query = Query({
  // })
  // query.getFixedDimensions()
  // query.constrain(constrainer)

  getValidComparisonRegions() {
    const {allRegions, query} = this.props
    const querySpec = this.getQuerySpec(query)
    const invalid = []
    const comparisonRegionsSpec = querySpec.find(spec => spec.name === 'comparisonRegions')
    const regions = comparisonRegionsSpec.choices.map(prefixedCode => {
      const found = allRegions.find(region => region.prefixedCode === prefixedCode)
      if (!found) {
        invalid.push(prefixedCode)
      }
      return found
    }).filter(Boolean)

    if (invalid.length > 0) {
      //const message = 'Warning: Query spec said the following region codes were valid comparison regions, '
      //                 + `but none of them was found in list of known regions: ${invalid.join(', ')}`
      //console.warn(new Error(message))
    }
    return regions
  }

  getQuerySpec(query) {
    const {activeTab, headerGroup, card} = this.props
    const chart = CHARTS[this.getChartKind()]
    return getQuerySpec(query, {
      tab: activeTab,
      headerGroup,
      chart,
      configuredDimensions: card.query.dimensions
    })
  }

  chartUrl() {
    const route = '/steder/:region/:pageName/:cardName/:tabName'
    const routeOpts = {
      cardName: this.props.card.name,
      tabName: this.props.activeTab.name
    }
    const host = window.location.hostname
    const port = `:${window.location.port}`
    const path = this.context.linkTo(route, routeOpts)
    return `${host}${config.env == 'development' ? port : ''}${path}`
  }


  render() {
    const {card, activeTab, headerGroup, query, region, allRegions} = this.props
    const showTable = this.state.showTable
    if (!card || !activeTab || !region || !allRegions) {
      return null
    }
    const validRegions = this.getValidComparisonRegions()
    const similarRegions = validRegions.filter(isSimilarRegion(region))
    const recommended = [] // todo
    const clipboard = new Clipboard('.clipboardButton') // eslint-disable-line no-unused-vars

    const disabledTabs = []
    if (headerGroup.aar.length < 2) {
      disabledTabs.push('chronological')
    }

    const graphDescription = describeChart(queryToOptions(query, card.name, headerGroup, allRegions))
    const chartData = Object.assign({}, this.props.data)
    let sortDirection = null

    const ChartComponent = showTable ? CHARTS.table.component : CHARTS[this.getChartKind()].component

    if (activeTab.name == 'benchmark') {
      sortDirection = 'ascending'
      chartData.highlight = {
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
        <TabBar activeTab={activeTab} disabledTabs={disabledTabs} tabs={TABS} makeLinkToTab={tab => this.makeLinkToTab(tab)}/>
        <FilterBar
          query={query}
          regionGroups={{recommended: recommended, similar: similarRegions, choices: validRegions}}
          querySpec={this.getQuerySpec(query)}
          onChange={this.handleFilterChange.bind(this)}
        />
        <div className="graph__types">
          <ul className="tabs-mini">
            <li className="tabs-mini__item">
              <span className="tabs-mini__link tabs-mini__link--current">Figur</span>{/* TODO: Make to function as tabs */}
            </li>
            <li className="tabs-mini__item">
              <a href="#" className="tabs-mini__link tabs-mini__link--current" onClick={this.handleTableToggle.bind(this)}>Tabell</a>
            </li>
          </ul>
        </div>
        <div className="graph">
          <ChartComponent data={chartData} sortDirection={sortDirection}/>
        </div>
        <div className="graph__description">
          {graphDescription}
        </div>
        <div className="graph__annotations">
        </div>
        <div className="graph__functions">
          <button type="button" className="button button--secondary button--small clipboardButton" data-clipboard-text={this.chartUrl()}>
            <i className="icon__export"></i> Lenke til figuren
          </button>
          <DownloadWidget region={region} allRegions={allRegions} data={chartData}/>
        </div>
        <CardMetadata metadata={card.metadata}/>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const cardState = state.cardState[ownProps.card.name]

  if (!cardState) {
    return {}
  }

  const {query, activeTab, data} = cardState

  const headerGroups = state.headerGroups[query.tableName]

  const regionHeaderKey = getHeaderKey(state.region)

  const headerGroup = headerGroups && headerGroups.find(group => {
    return group.hasOwnProperty(regionHeaderKey) && query.dimensions.every(dim => group.hasOwnProperty(dim.name))
  })
  return {
    region: state.region,
    allRegions: state.allRegions,
    headerGroup,
    data,
    headerGroups,
    activeTab,
    query
  }
}

export default connect(mapStateToProps)(Card)
