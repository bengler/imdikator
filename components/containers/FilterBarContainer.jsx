import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import FilterBar from '../elements/filter/FilterBar'
import update from 'react-addons-update'
import RegionFilterSelect from '../elements/filter/RegionFilterSelect'
import FilterSelect from '../elements/filter/FilterSelect'
import {dimensionLabelTitle} from '../../lib/labels'
import {getQuerySpec, constrainQuery} from '../../lib/querySpec'
import {keyBy} from 'lodash'
import arrayEqual from 'array-equal'
import {comparisonDescription, isSimilarRegion} from '../../lib/regionUtil'
import humanizeList from 'humanize-list'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

let shouldWarnAboutMissingCodes = process.env.NODE_ENV !== 'production'

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
    config: PropTypes.object,
    region: ImdiPropTypes.region.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: {
      dimensions: {}
    }
  };

  handleFilterChange(dimension, newValue) {
    if (dimension === 'comparisonRegions') {
      newValue = newValue.map(val => val.prefixedCode)
    }

    const {query, config} = this.props

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

    const constrainedQuery = constrainQuery(newQuery, this.getQuerySpec(newQuery), config)
    if (process.env.NODE_ENV !== 'production') {
      constrainedQuery.operations.forEach(op => {
        console.log('[debug] %s: %s', op.dimension, op.description) // eslint-disable-line no-console
      })
    }
    this.props.onChange(constrainedQuery.query)
  }

  getIndexedRegions() {
    if (!this._indexedRegions) {
      this._indexedRegions = keyBy(this.props.allRegions, 'prefixedCode')
    }
    return this._indexedRegions
  }

  getDimensionValueFromQuery(dimensionName) {
    const {query} = this.props

    if (query.hasOwnProperty(dimensionName)) {
      return query[dimensionName]
    }

    return query.dimensions.find(dim => dim.name == dimensionName).variables
  }

  getRegionByPrefixedCode(prefixedCode) {
    return this.getIndexedRegions()[prefixedCode]
  }

  getQuerySpec(query) {
    const {tab, chart, config, headerGroups} = this.props
    return getQuerySpec(query, {
      tab: tab,
      chart: chart,
      headerGroups: headerGroups,
      config: config
    })
  }

  findRegionsByPrefixes(prefixedCodes, warnMissing = true) {
    const missing = []
    const regions = prefixedCodes.map(prefixedCode => {
      const found = this.getRegionByPrefixedCode(prefixedCode)
      if (!found && warnMissing) {
        missing.push(prefixedCode)
      }
      return found
    }).filter(Boolean)

    if (shouldWarnAboutMissingCodes && missing.length > 0) {
      const message = `[Warning]: Some region codes could not be mapped correctly. `
                      + `These may be may be old codes not in use anymore: ${missing.join(', ')}`
      console.warn(new Error(message)) // eslint-disable-line no-console
      shouldWarnAboutMissingCodes = false
    }
    return regions
  }

  createRegionFilterFromSpec(spec) {

    const {region, tab} = this.props

    const validRegions = this.findRegionsByPrefixes(spec.choices, true)
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
        description: <span></span>,
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
        choices: validRegions,
        renderChoice
      }
    }
  }

  render() {

    const {query, config} = this.props
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
        const dimensionConfig = (config.dimensions || {})[spec.name]
        if (dimensionValue === 'all' || dimensionConfig && arrayEqual(dimensionValue, dimensionConfig.include || [])) {
          return 'Alle' // aggregert
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
