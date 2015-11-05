import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import FilterBar from '../elements/filter/FilterBar'
import update from 'react-addons-update'
import RegionFilterSelect from '../elements/filter/RegionFilterSelect'
import FilterSelect from '../elements/filter/FilterSelect'
import {dimensionLabelTitle} from '../../lib/labels'
import {getQuerySpec, constrainQuery} from '../../lib/querySpec'
import arrayEqual from 'array-equal'
import {getHeaderKey, comparisonDescription, isSimilarRegion} from '../../lib/regionUtil'
import humanizeList from 'humanize-list'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class FilterBarContainer extends Component {
  static propTypes = {
    allRegions: PropTypes.arrayOf(ImdiPropTypes.region).isRequired,
    query: ImdiPropTypes.query.isRequired,
    headerGroups: PropTypes.array.isRequired,
    tab: PropTypes.shape({
      name: PropTypes.string
    }).isRequired,
    chart: PropTypes.shape({
      capabilities: PropTypes.shape({
        dimensions: PropTypes.number
      })
    }).isRequired,
    dimensionsConfig: PropTypes.object,
    region: ImdiPropTypes.region.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    dimensionsConfig: {}
  }

  handleFilterChange(dimension, newValue) {
    if (dimension === 'comparisonRegions') {
      newValue = newValue.map(val => val.prefixedCode)
    }

    const {query, dimensionsConfig} = this.props

    let newQuery
    if (['comparisonRegions', 'unit', 'year'].includes(dimension)) {
      newQuery = Object.assign({}, query, {
        [dimension]: newValue
      })
    } else {
      newQuery = update(query, {
        dimensions: {
          $apply: dimensions => {
            return dimensions.map(dim => {
              if (dim.name !== dimension) {
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

    const constrainedQuery = constrainQuery(newQuery, this.getQuerySpec(newQuery), dimensionsConfig)
    constrainedQuery.operations.forEach(op => {
      console.log('%s: %s', op.dimension, op.description) // eslint-disable-line no-console
    })
    this.props.onChange(constrainedQuery.query)
  }

  getDimensionValueFromQuery(dimensionName) {
    const {query} = this.props

    if (query.hasOwnProperty(dimensionName)) {
      return query[dimensionName]
    }

    return query.dimensions.find(dim => dim.name == dimensionName).variables
  }

  getRegionByPrefixedCode(prefixedCode) {
    // ugh
    return this.props.allRegions.find(reg => reg.prefixedCode === prefixedCode)
  }

  getQuerySpec(query) {
    const {tab, chart, dimensionsConfig} = this.props
    return getQuerySpec(query, {
      tab: tab,
      chart: chart,
      headerGroup: this.getHeaderGroupForQuery(query),
      dimensionsConfig: dimensionsConfig
    })
  }

  getHeaderGroupForQuery(query) {
    const {region, headerGroups} = this.props
    const regionHeaderKey = getHeaderKey(region)
    return headerGroups.find(group => {
      return group.hasOwnProperty(regionHeaderKey) && query.dimensions.every(dim => group.hasOwnProperty(dim.name))
    })
  }

  getValidComparisonRegions(comparisonRegionSpec) {
    const {allRegions} = this.props
    const invalid = []
    const regions = comparisonRegionSpec.choices.map(prefixedCode => {
      const found = allRegions.find(reg => reg.prefixedCode === prefixedCode)
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

  createRegionFilterFromSpec(spec) {

    const {region, tab} = this.props

    const validRegions = this.getValidComparisonRegions(spec)
    const similarRegions = validRegions.filter(isSimilarRegion(region))

    const renderChoice = (choice, i, choices) => {
      if (tab.name == 'benchmark') {
        return comparisonDescription(region)
      }
      return humanizeList(choice.map(reg => reg.name), {conjunction: 'og'})
    }

    const groups = [
      {
        name: 'similar',
        title: 'Anbefalte regioner',
        description: <span>TODO</span>,
        items: similarRegions
      },
      // todo: {name: 'recommended' ...}
    ]

    return {
      name: spec.name,
      component: RegionFilterSelect,
      props: {
        label: 'Sammenlignet med',
        locked: tab.name == 'benchmark',
        value: this.getDimensionValueFromQuery(spec.name).map(this.getRegionByPrefixedCode.bind(this)),
        groups: groups,
        choices: spec.choices.map(this.getRegionByPrefixedCode.bind(this)),
        renderChoice
      }
    }
  }

  render() {

    const {query, dimensionsConfig} = this.props
    if (!query) {
      return null
    }
    const querySpec = this.getQuerySpec(query)

    const filters = querySpec.map(spec => {
      if (spec.name === 'comparisonRegions') {
        return this.createRegionFilterFromSpec(spec)
      }

      return {
        name: spec.name,
        component: FilterSelect,
        props: {
          label: dimensionLabelTitle(spec.name), // todo
          locked: spec.locked,
          hidden: spec.hidden,
          constrained: spec.constrained,
          value: this.getDimensionValueFromQuery(spec.name),
          choices: spec.choices,
          renderChoice: renderSelectContent
        }
      }

      function renderSelectContent(dimensionValue, index, all) {
        const config = dimensionsConfig[spec.name]
        if (dimensionValue === 'all' || config && arrayEqual(dimensionValue, config.include || [])) {
          return 'Alle' // aggregated
        }
        if (spec.name == 'kjonn' && dimensionValue.length === 1 && dimensionValue[0] === 'alle') {
          return 'Skjul' // vis nedbrytninger
        }
        return humanizeList(dimensionValue.map(val => dimensionLabelTitle(spec.name, val)), {conjunction: 'og'})
      }

    })

    return (
      <FilterBar filters={filters} onChange={this.handleFilterChange.bind(this)}/>
    )
  }
}

function mapStateToProps(state, ownProps) {

  const {query} = ownProps
  const {allRegions, headerGroups} = state

  return {
    allRegions: allRegions,
    headerGroups: headerGroups[query.tableName]
  }
}

export default connect(mapStateToProps)(FilterBarContainer)
