import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RegionSelect from './RegionSelect'
import {dimensionLabelTitle} from '../../lib/labels'
import capitalize from 'lodash.capitalize'
import {comparisonDescription, regionByPrefixedCode} from '../../lib/regionUtil'

import cx from 'classnames'

import {_t} from '../../lib/translate'

function renderRegion(region) {
  return `${region.name} ${_t(region.type)}`
}

// Compares contents of two arrays and returns true if values + indexes match
function valuesEqual(value) {
  if (!Array.isArray(value)) {
    return other => value === other
  }
  return other => {
    if (value.length !== other.length) {
      return false
    }
    return value.every((item, i) => item === other[i])
  }
}

// Todo: remove duplication
const RegionType = PropTypes.shape({
  code: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string
})

class FilterBar extends Component {
  static propTypes = {
    querySpec: PropTypes.array,
    query: PropTypes.object,
    allRegions: PropTypes.array,
    onChange: PropTypes.func,
    regionGroups: PropTypes.shape({
      recommended: PropTypes.arrayOf(RegionType),
      similar: PropTypes.arrayOf(RegionType),
      choices: PropTypes.arrayOf(RegionType)
    })
  }

  static defaultProps = {}

  constructor(props) {
    super()
    this.state = {
      isRegionSelectOpen: false,
      regionsValue: null
    }
  }

  renderRegionFilter() {
    const {querySpec} = this.props
    const comparisonRegions = this.getSelectedComparisonRegions()
    const hasComparisonRegions = comparisonRegions.length > 0
    const comparisonRegionsSpec = querySpec.find(dimension => dimension.name == 'comparisonRegions')

    function getButtonText(region) {
      if (comparisonRegionsSpec.locked) {
        return comparisonDescription(region)
      }
      if (hasComparisonRegions) {
        return comparisonRegions.map(renderRegion).join(', ')
      }
      return 'Legg til sted'
    }

    const region = regionByPrefixedCode(this.props.query.region, this.props.allRegions)
    return (
      <button type="button"
        disabled={comparisonRegionsSpec.locked}
        className={`subtle-select__button subtle-select__button--${hasComparisonRegions ? 'expanded' : 'add'}`}
        onClick={() => this.setState({isRegionSelectOpen: true})}
      >
        {getButtonText(region)}
      </button>
    )
  }

  getSelectedComparisonRegions() {
    const {query, regionGroups: {choices}} = this.props
    return (query.comparisonRegions || []).map(prefixedCode => choices.find(choice => prefixedCode === choice.prefixedCode))
  }

  renderRegionSelectLightbox() {
    const {querySpec, regionGroups: {similar, recommended, choices}} = this.props

    const comparisonRegionsFilter = querySpec.find(dimension => dimension.name == 'comparisonRegions')

    const handleApplyRegionFilter = newValue => {
      this.handleFilterChange(comparisonRegionsFilter, newValue.map(region => region.prefixedCode))
      this.setState({isRegionSelectOpen: false})
    }
    const handleCancelRegionFilter = () => this.setState({isRegionSelectOpen: false})
    return (
      <li>
        <RegionSelect
          onCancel={handleCancelRegionFilter}
          onApply={handleApplyRegionFilter}
          similar={similar}
          recommended={recommended}
          choices={choices}
          value={this.getSelectedComparisonRegions()}
        />
      </li>
    )
  }

  handleFilterChange(dimension, newValue) {
    this.props.onChange(dimension.name, newValue)
  }

  getDimensionValueFromQuery(dimensionName) {
    const {query} = this.props

    if (query.hasOwnProperty(dimensionName)) {
      return query[dimensionName]
    }

    return query.dimensions.find(dim => dim.name == dimensionName).variables
  }

  renderFilter(dimension) {
    const {choices} = dimension

    const onChange = event => {
      const value = choices[event.target.value]
      this.handleFilterChange(dimension, value)
    }

    const disabled = dimension.locked || choices.length == 1

    const selectContainerClassName = cx({
      select: true,
      'subtle-select__select': true,
      'subtle-select__select--disabled': disabled
    })

    const value = this.getDimensionValueFromQuery(dimension.name)
    const index = choices.findIndex(valuesEqual(value))

    const wrapInLocked = children => {
      return (
        // todo: animate when changes using css class 'field-notification--animate'
        <div className="field-notification">
          <p className="field-notification__caption">
            <i className="icon__arrow-right"/>
            Avgrenset
          </p>
          {children}
        </div>
      )
    }

    const filter = (
      <div className="subtle-select">
        <label htmlFor="filter-groups" className="subtle-select__label">{dimensionLabelTitle(dimension.name)}:</label>
        <div className={selectContainerClassName}>
          <select
            value={index}
            disabled={disabled}
            onChange={onChange}>
            {choices.map((choice, i) => (
              <option value={i} key={i}>{this.renderChoice(dimension.name, choice, choices)}</option>
            ))}
          </select>
        </div>
      </div>
    )

    return dimension.locked ? wrapInLocked(filter) : filter

  }

  renderChoice(dimension, choice, choices) {
    if (choice === 'all') {
      return 'Alle'
    }

    if (choice.length === 1 && choice[0] === 'alle') {
      const hasAll = choices.some(c => c.length > 1)
      return hasAll ? 'Skjul' : 'Alle'
    }
    if (choice.length > 1) {
      return 'Vis'
    }
    return capitalize(dimensionLabelTitle(dimension, choice[0]))
  }

  render() {
    const {querySpec} = this.props

    const dimensionsWithoutRegions = querySpec.filter(dimension => {
      return dimension.name !== 'comparisonRegions'
    })

    const {isRegionSelectOpen} = this.state
    //return filters
    //  .filter(filter => filter.name !== 'comparisonRegions')
    //  .map(filter => {

    return (
      <section className="graph__filter">
        <h5 className="t-only-screenreaders">Filter</h5>
        <ul className="row t-position">
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">
                Sammenliknet med:
              </label>
              {this.renderRegionFilter()}
            </div>
          </li>
          {/* todo: avoid rendering the lightbox in the adjacent <li> maybe? (and investigate possible ua issues?) */}
          {isRegionSelectOpen && this.renderRegionSelectLightbox()}
          {dimensionsWithoutRegions.map(dimension => (
          <li key={dimension.name} className="col--fifth">{this.renderFilter(dimension)}</li>
            ))}
        </ul>
        <div>
          {/*<div><pre>{JSON.stringify(query)}</pre></div>*/}
          {/*<div><pre>{JSON.stringify(querySpec)}</pre></div>*/}
        </div>
      </section>
    )
  }
}
function mapStateToProps(state) {
  return {
    allRegions: state.allRegions
  }
}

export default connect(mapStateToProps)(FilterBar)
