import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RegionSelect from '../elements/filter/RegionSelect'
import {findDimensionByName, dimensionLabelTitle} from '../../lib/labels'

import {_t} from '../../lib/translate'

function renderRegion(region) {
  return `${region.name} ${_t(region.type)}`
}


class FilterBar extends Component {
  static propTypes = {
    allRegions: PropTypes.array,
    card: PropTypes.object,
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

  renderDimensions() {
    const {headerGroup} = this.props
    return Object.keys(headerGroup)
      .map(findDimensionByName)
      .filter(Boolean)
      .map(dimension => {
        const values = headerGroup[dimension.name]

        return (
          <li key={dimension.name} className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">{dimension.title}:</label>

              <div className="select subtle-select__select">
                <select>
                  {values.map(value => <option
                    key={dimension.name + value}>{dimensionLabelTitle(dimension.name, value)}</option>)}
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
