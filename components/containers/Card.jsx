import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import TabBar from '../elements/TabBar'
import FilterBar from './FilterBar'
import {findDimensionByName, dimensionLabelTitle} from '../../lib/labels'
import {getPrefixForRegionConditionKey} from '../../lib/api-client/toVismaQuery'
import {performQuery} from '../../actions/cardPages'

function flatten() {
  return this.reduce((flattened, el) => flattened.concat(el))
}

//import {performQuery} from '../../actions/cardPages'
import {getHeaderKey} from '../../lib/regionUtil'

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    query: PropTypes.object,
    data: PropTypes.object,
    headerGroup: PropTypes.object,
    table: PropTypes.object,
    activeTab: PropTypes.object,
    boundUpdateCardQuery: PropTypes.func,
    dispatch: PropTypes.func
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

    this.props.dispatch(performQuery(card, activeTab, newQuery))
  }

  getChartKind() {
    const {activeTab} = this.props
    return activeTab.chartKind
  }

  getFilterState() {
    const {activeTab, card, headerGroup, query} = this.props

    const chartKind = this.getChartKind()

    const capabilities = CHARTS[chartKind].capabilities

    const availableRegions = ['kommuneNr', 'naringsregionNr', 'bydelNr', 'fylkeNr']
      .filter(regionKey => regionKey in headerGroup)
      .map(regionKey => {
        const prefix = getPrefixForRegionConditionKey(regionKey)
        return headerGroup[regionKey].map(code => `${prefix}${code}`)
      })
      .filter(Boolean)
      ::flatten() // Trying out some experimental es7 features. Shame on me!

    const regionFilterState = {
      name: 'comparisonRegions',
      title: 'Sammenlignet med',
      enabled: ['latest', 'chronological', 'table'].includes(activeTab.name),
      value: query.comparisonRegions,
      options: availableRegions.map(regionCode => {
        return {value: regionCode, title: regionCode}
      })
    }

    const timeFilterState = {
      enabled: !(['chronological'].includes(activeTab.name)),
      name: 'year',
      title: 'År',
      value: query.year,
      options: activeTab.name === 'chronological' ? [{name: 'alle', title: 'Alle'}] : headerGroup.aar.map(year => {
        return {value: year, title: year}
      })
    }

    const unitFilterState = {
      enabled: headerGroup.enhet.length > 1,
      name: 'unit',
      title: headerGroup.enhet.join(' eller '),
      options: headerGroup.enhet.map(unit => {
        return {value: unit, title: unit}
      })
    }

    let availDimensions = capabilities.dimensions
    const otherDimensions = card.query.dimensions
      .map((dimension, i) => {
        const configuredDimension = findDimensionByName(dimension.name)
        const values = headerGroup[dimension.name]

        const includesAll = values.some(val => val == 'alle')

        const canExpand = ''
        if (availDimensions--) {
          // ok ok
        }
        return {
          enabled: i > 0,
          visible: dimension.visible,
          value: dimension.name,
          title: configuredDimension.title,
          options: values.map(value => {
            return {name: value, title: dimensionLabelTitle(dimension.name, value)}
          })
        }
      })

    return [regionFilterState, timeFilterState, ...otherDimensions, unitFilterState]
  }

  render() {
    const {card, activeTab, headerGroup} = this.props

    //console.log('query', query)

    if (!card) {
      return null
    }

    if (!activeTab) {
      return null
    }

    let tableDescription = ''
    if (this.props.table) {
      tableDescription = this.props.table.description
    }
    const ChartComponent = CHARTS[this.getChartKind()].component
    return (
      <div
        className="toggle-list__section toggle-list__section--expanded"
        aria-hidden="false"
        style={{display: 'block'}}
      >
        <TabBar activeTab={activeTab} tabs={TABS} makeLinkToTab={tab => this.makeLinkToTab(tab)}/>
        <FilterBar
          headerGroup={headerGroup}
          filters={this.getFilterState()}
          onChange={this.handleFilterChange.bind(this)}
        />
        <ChartComponent data={this.props.data}/>
        <small>{tableDescription}</small>
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
  const table = state.tables[query.tableName]

  const headerKey = getHeaderKey(state.region)

  const headerGroup = headerGroups && headerGroups.find(group => headerKey in group)
  return {
    headerGroup,
    data,
    headerGroups,
    table,
    activeTab,
    query
  }
}

export default connect(select)(Card)
