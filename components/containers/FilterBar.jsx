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
    cardState: PropTypes.object,
    headerGroups: PropTypes.array
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

  renderUnitSelect() {
    return (
      <select>
        <option selected>Antall personer</option>
        <option>Andel av befolkningen</option>
      </select>
    )
  }

  renderGenderDistributionSelect() {
    return (
      <select>
        <option selected>Skjult</option>
        <option>Vis kjønnsfordeling</option>
      </select>
    )
  }

  renderPeriodSelect() {
    return (
      <select>
        <option selected>2014</option>
        <option selected>2013</option>
      </select>
    )
  }

  renderInnvkatSelect() {
    return (
      <select disabled>
        <option selected>Vis alle</option>
        <option>Innvandrere</option>
        <option>Norskfødte med innvandrerforeldre</option>
        <option>Befolkningen ellers</option>
        <option>Befolkningen</option>
      </select>
    )
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
          {isRegionSelectOpen && this.renderRegionSelectLightbox()}
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Kjønnsfordeling:</label>
              <div className="select subtle-select__select">
                {this.renderGenderDistributionSelect()}
              </div>
            </div>
          </li>
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Befolkningsgrupper:</label>
              <div className="select subtle-select__select  subtle-select__select--disabled">
                {this.renderInnvkatSelect()}
              </div>
            </div>
          </li>
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Andel og antall:</label>
              <div className="select subtle-select__select">
                {this.renderUnitSelect()}
              </div>
            </div>
          </li>
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Periode:</label>

              <div className="select subtle-select__select">
                {this.renderPeriodSelect()}
              </div>
            </div>
          </li>
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
