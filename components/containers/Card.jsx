import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import TabBar from '../elements/TabBar'
import FilterBar from './FilterBar'
import CardMetadata from '../elements/CardMetadata'
import {findDimensionByName, dimensionLabelTitle} from '../../lib/labels'
import {constrainQuery, getQuerySpec} from '../../lib/querySpec'
import {performQuery} from '../../actions/cardPages'
import {isSimilarRegion} from '../../lib/regionUtil'


//import {performQuery} from '../../actions/cardPages'
import {getHeaderKey} from '../../lib/regionUtil'

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    region: PropTypes.object,
    query: PropTypes.object,
    data: PropTypes.object,
    headerGroup: PropTypes.object,
    table: PropTypes.object,
    activeTab: PropTypes.object,
    boundUpdateCardQuery: PropTypes.func,
    dispatch: PropTypes.func,
    allRegions: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  makeLinkToTab(tab) {
    return this.context.linkTo('/steder/:region/:pageName/:cardName/:tabName', {
      cardName: this.props.card.name,
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
      console.log('%s: %s', op.dimension, op.description)
    })
    this.props.dispatch(performQuery(card, activeTab, constrainedQuery.query))
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

  render() {
    const {card, activeTab, headerGroup, query, region, allRegions} = this.props

    if (!card || !activeTab || !region) {
      return null
    }

    const validRegions = this.getValidComparisonRegions()
    const similarRegions = validRegions.filter(isSimilarRegion(region))
    const recommended = [] // todo

    const disabledTabs = []
    if (headerGroup.aar.length < 2) {
      disabledTabs.push('chronological')
    }

    const ChartComponent = CHARTS[this.getChartKind()].component
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
        <div className="graph">
          <ChartComponent data={this.props.data}/>
        </div>
        <div className="graph__functions">
          <button type="button" className="button button--secondary button--small">
            <i className="icon__export"></i> Lenke til grafen
          </button>
          <button type="button" className="button button--secondary button--small">
            <i className="icon__download"></i> Last ned
          </button>
        </div>
        <CardMetadata metadata={card.metadata}/>
      </div>
    )
  }
}

function select(state, ownProps) {
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

export default connect(select)(Card)
