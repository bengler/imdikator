import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RegionSelect from '../elements/filter/RegionSelect'

import {_t} from '../../lib/translate'

function renderRegion(region) {
  return `${region.name} ${_t(region.type)}`
}

class FilterBar extends Component {
  static propTypes = {
    allRegions: PropTypes.array,
    card: PropTypes.object,
    filters: PropTypes.array,
    onChange: PropTypes.func,
    cardState: PropTypes.object,
    headerGroup: PropTypes.object
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
    const {regionsValue} = this.state

    const chosenRegions = Object.keys(regionsValue || {}).reduce((val, key) => {
      return val.concat(regionsValue[key])
    }, [])

    const hasRegions = chosenRegions.length > 0

    return (
      <button type="button"
        className={`subtle-select__button subtle-select__button--${hasRegions ? 'expanded' : 'add'}`}
        onClick={() => this.setState({isRegionSelectOpen: true})}>
        {hasRegions && chosenRegions.map(renderRegion).join(', ')}
        {!hasRegions && 'Legg til sted'}
      </button>
    )
  }

  renderRegionSelectLightbox() {
    const {similarRegions, regionsValue} = this.state
    const {allRegions} = this.props

    const options = {
      similar: allRegions.slice(0, 5),
      average: allRegions.slice(0, 5)
    }

    const handleApplyRegionFilter = newValue => this.setState({regionsValue: newValue, isRegionSelectOpen: false})
    const handleCancelRegionFilter = () => this.setState({isRegionSelectOpen: false})
    return (
      <li>
        <RegionSelect
          options={options}
          value={regionsValue}
          onCancel={handleCancelRegionFilter}
          onApply={handleApplyRegionFilter}
          similarRegions={similarRegions}
          />
      </li>
    )
  }

  handleFilterChange(filter, newValue) {
    this.props.onChange(filter.name, newValue)
  }

  renderDimensions() {
    const {filters} = this.props
    return filters.map(filter => {
      const multiple = filter.name === 'comparisonRegions'
      const onChange = event => {
        let val
        if (multiple) {
          val = Array.from(event.target.options).filter(opt => opt.selected).map(el => el.value)
        } else {
          val = event.target.value
        }
        this.handleFilterChange(filter, val)
      }
      return (
        <li key={filter.name} className="col--fifth">
          <div className="subtle-select">
            <label htmlFor="filter-groups" className="subtle-select__label">{filter.title}:</label>
            <div className="select subtle-select__select">
              <select
                multiple={multiple}
                value={filter.value}
                disabled={!filter.enabled || filter.options.length == 1}
                onChange={onChange}>
                {filter.options.map(option => (
                  <option value={option.value} key={option.name + option.value}>{option.title}</option>
                ))}
              </select>
            </div>
          </div>
        </li>
      )
    })
  }

  render() {
    const {allRegions} = this.props
    if (!allRegions) {
      return null
    }

    const {isRegionSelectOpen} = this.state

    return (
      <section className="graph__filter">
        <h5 className="t-only-screenreaders">Filter</h5>
        <ul className="t-no-list-styles row">
          {/*
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">
                Sammenliknet med:
              </label>
              {this.renderRegionFilter()}
            </div>
          </li>
          */}
          {/* todo: avoid rendering the lightbox in the adjacent <li> maybe? (and investigate possible ua issues?) */}
          {isRegionSelectOpen && this.renderRegionSelectLightbox()}
          {this.renderDimensions()}
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
