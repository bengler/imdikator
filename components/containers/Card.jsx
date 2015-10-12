import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import update from 'react-addons-update'
import {CHARTS} from '../../config/chartTypes'
import {TABS} from '../../config/tabs'
import TabBar from '../elements/TabBar'
import FilterBar from './FilterBar'
import {findDimensionByName, dimensionLabelTitle} from '../../lib/labels'
import {performQuery} from '../../actions/cardPages'
import {comparableRegionCodesPrefixified} from '../../lib/regionUtil'


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
                variables: newValue.split(',')
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
    const {activeTab, card, headerGroup, query, region} = this.props

    const chartKind = this.getChartKind()

    const capabilities = CHARTS[chartKind].capabilities

    const regionFilterState = {
      name: 'comparisonRegions',
      title: 'Sammenlignet med',
      enabled: ['latest', 'chronological', 'table'].includes(activeTab.name),
      value: query.comparisonRegions,
      options: {
        similar: comparableRegionCodesPrefixified(region, this.props.allRegions),
        recommended: []
      }
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
      value: query.unit,
      title: headerGroup.enhet.length > 1 ? headerGroup.enhet.join(' eller ') : 'Enhet',
      options: headerGroup.enhet.map(unit => {
        return {value: unit, title: unit}
      })
    }

    // Note: For robustness decorate card.query.dimensions with headergroups

    let availDimensions = capabilities.dimensions
    if (query.comparisonRegions.length > 0) {
      availDimensions--
    }
    const otherDimensions = card.query.dimensions
      .map((dimension, i) => {
        const configuredDimension = findDimensionByName(dimension.name)
        const values = headerGroup[dimension.name]
        const valuesWithoutAggregate = values.filter(val => val != 'alle')
        //const valuesContainsAggregate = values.some(val => val == 'alle')

        // If we have available dimensions. Lock first dimension as to not confuse users.

        let enabled = true

        if (i == 0 && availDimensions > 0) {
          enabled = false
        }

        let canExpandDimensionVariables = false

        // Can dimension expand, or does the user need to choose amongst the variables
        if (availDimensions > 0) {
          canExpandDimensionVariables = true
        }

        // If headergroup for dimension does not contain 'alle' ->

        let options

        if (!enabled) {
          // Perhaps there are others reasons something is disabled. Right now only reason is that the user can't change it
          options = [
            {
              title: 'Viser alle',
              value: ''
            }
          ]

        } else if (canExpandDimensionVariables) {
          options = [
            {
              title: 'Skjult',
              value: 'alle'
            },
            {
              title: 'Vis',
              value: valuesWithoutAggregate.join(',')
            }
          ]
        } else {
          // output everything in the header group
          options = values.map(value => {
            return {
              value: value,
              title: dimensionLabelTitle(dimension.name, value)
            }
          })
        }

        /*
         if (enabled && !canExpandDimensionVariables) {
         // is enabled && canExpandDimensionVariables-> display as constrained with yellow border and stuff
         }
         */

        availDimensions--
        const value = query.dimensions.find(dim => dim.name == dimension.name).variables
        return {
          enabled,
          value: value && value.join(','),
          visible: dimension.visible,
          name: dimension.name,
          title: configuredDimension.title,
          options
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
          filters={this.getFilterState()}
          onChange={this.handleFilterChange.bind(this)}
          />
        <div className="graph">  
          <ChartComponent data={this.props.data}/>
        </div>
        <div className="graph__annotations">{tableDescription}</div>      
        <div className="graph__functions">
		  <button type="button" className="button button--secondary button--small"><i className="icon__export"></i> Lenke til grafen</button>				
		  <button type="button" className="button button--secondary button--small"><i className="icon__download"></i> Last ned</button>
	    </div>
	    <div className="graph__about">										
		  <div className="toggle toggle--light t-no-margin">
	        <a href="#" className="toggle__button"><span className="toggle__caption--contracted"> Veiledning og kilder</span><span className="toggle__caption--expanded">Skjul veiledning og kilder</span> <i className="icon__arrow-down toggle__icon"></i></a>
		  </div>        
        </div>
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
    table,
    activeTab,
    query
  }
}

export default connect(select)(Card)
