import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RegionSelect from './RegionSelect'
import {prefixify} from '../../lib/regionUtil'
import cx from 'classnames'

import {_t} from '../../lib/translate'

class FilterBar extends Component {
  static propTypes = {
    filters: PropTypes.array,
    onChange: PropTypes.func,
    allRegions: PropTypes.array // todo: get rid of this
  }

  static defaultProps = {}

  constructor(props) {
    super()
    this.state = {
      isRegionSelectOpen: false,
      regionsValue: null
    }
  }

  renderRegion(regionCode) {
    const region = this.props.allRegions.find(reg => {
      return prefixify(reg) === regionCode
    })
    return `${region.name} ${_t(region.type)}`
  }
  renderRegionFilter(filter) {
    const {value} = filter

    const hasRegions = value && value.length > 0

    return (
      <button type="button"
        className={`subtle-select__button subtle-select__button--${hasRegions ? 'expanded' : 'add'}`}
        onClick={() => this.setState({isRegionSelectOpen: true})}
        >
        {hasRegions && value.map(this.renderRegion.bind(this)).join(', ')}
        {!hasRegions && 'Legg til sted'}
      </button>
    )
  }

  renderRegionSelectLightbox(comparisonRegionsFilter) {
    const {similar, recommended} = comparisonRegionsFilter.options
    const handleApplyRegionFilter = newValue => {
      this.handleFilterChange(comparisonRegionsFilter, newValue)
      this.setState({isRegionSelectOpen: false})
    }
    const handleCancelRegionFilter = () => this.setState({isRegionSelectOpen: false})
    return (
      <li>
        <RegionSelect
          value={comparisonRegionsFilter.value}
          onCancel={handleCancelRegionFilter}
          onApply={handleApplyRegionFilter}
          similar={similar}
          recommended={recommended}
          />
      </li>
    )
  }

  handleFilterChange(filter, newValue) {
    this.props.onChange(filter.name, newValue)
  }

  renderFilter(filter) {
    const onChange = event => {
      const val = filter.options[event.target.value].value
      this.handleFilterChange(filter, val)
    }

    const selectContainerClassName = cx({
      select: true,
      'subtle-select__select': true,
      'subtle-select__select--disabled': !filter.enabled
    })

    return (
      <div className="subtle-select">
        <label htmlFor="filter-groups" className="subtle-select__label">{filter.title}:</label>
        <div className={selectContainerClassName}>
          <select
            value={filter.value}
            disabled={!filter.enabled || filter.options.length == 1}
            onChange={onChange}>
            {filter.options.map((option, i) => (
              <option value={i} key={option.name + option.value}>{option.title}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  render() {
    const {filters} = this.props

    const {isRegionSelectOpen} = this.state

    const comparisonRegionsFilter = filters.find(filter => filter.name === 'comparisonRegions')
    const otherFilters = filters.filter(filter => filter !== comparisonRegionsFilter)

    //return filters
    //  .filter(filter => filter.name !== 'comparisonRegions')
    //  .map(filter => {

    return (
      <section className="graph__filter">
        <h5 className="t-only-screenreaders">Filter</h5>
        <ul className="t-no-list-styles row">
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">
                Sammenliknet med:
              </label>
              {this.renderRegionFilter(comparisonRegionsFilter)}
            </div>
          </li>
          {/* todo: avoid rendering the lightbox in the adjacent <li> maybe? (and investigate possible ua issues?) */}
          {isRegionSelectOpen && this.renderRegionSelectLightbox(comparisonRegionsFilter)}
          {otherFilters.map(filter => (
            <li key={filter.name} className="col--fifth">{this.renderFilter(filter)}</li>
          ))}
        </ul>
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
