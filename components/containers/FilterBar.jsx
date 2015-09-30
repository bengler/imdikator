import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RegionSelect from '../elements/filter/RegionSelect'

import {_t} from '../../lib/translate'

function renderRegion(region) {
  return `${region.name} ${_t(region.type)}`
}

class FilterBar extends Component {
  static propTypes = {
    allRegions: PropTypes.array
  }
  static defaultProps = {
  }

  constructor(props) {
    super()
    this.state = {
      isRegionSelectOpen: false,
      regionsValue: null
    }
  }

  openRegionSelect() {
    this.setState({isRegionSelectOpen: true})
  }

  handleApplyRegionFilter(newValue) {
    this.setState({regionsValue: newValue, isRegionSelectOpen: false})
  }

  handleCancelRegionFilter() {
    this.setState({isRegionSelectOpen: false})
  }

  render() {
    const {allRegions} = this.props
    if (!allRegions) {
      return null
    }

    const {similarRegions, isRegionSelectOpen, regionsValue} = this.state

    const options = {
      similar: allRegions.slice(0, 5),
      average: allRegions.slice(0, 5)
    }

    const chosenRegions = Object.keys(regionsValue || {}).reduce((val, key) => {
      return val.concat(regionsValue[key])
    }, [])

    const hasRegions = chosenRegions.length > 0
    return (
      <section className="graph__filter">
        <h5 className="t-only-screenreaders">Filter</h5>
        <ul className="t-no-list-styles row">
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">
                Sammenliknet med:
              </label>
              <button type="button" className={`subtle-select__button subtle-select__button--${hasRegions ? 'expanded' : 'add'}`}
                      onClick={this.openRegionSelect.bind(this)}>
                {hasRegions && chosenRegions.map(renderRegion).join(', ')}
                {!hasRegions && 'Legg til sted'}
              </button>
            </div>
          </li>
          {isRegionSelectOpen && (
            <li>
              <RegionSelect
                options={options}
                value={regionsValue}
                onCancel={this.handleCancelRegionFilter.bind(this)}
                onApply={this.handleApplyRegionFilter.bind(this)}
                similarRegions={similarRegions}
                />
            </li>
          )}
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Kjønnsfordeling:</label>

              <div className="select subtle-select__select">
                <select id="filter-groups">
                  <option selected>Skjult</option>
                  <option>Vis kjønnsfordeling</option>
                </select>
              </div>
            </div>
          </li>
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Befolkningsgrupper:</label>

              <div className="select subtle-select__select  subtle-select__select--disabled">
                <select id="filter-groups" disabled>
                  <option selected>Vis alle</option>
                  <option>Innvandrere</option>
                  <option>Norskfødte med innvandrerforeldre</option>
                  <option>Befolkningen ellers</option>
                  <option>Befolkningen</option>
                </select>
              </div>
            </div>
          </li>
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Andel og antall:</label>

              <div className="select subtle-select__select">
                <select id="filter-measure">
                  <option selected>Antall personer</option>
                  <option>Andel av befolkningen</option>
                </select>
              </div>
            </div>
          </li>
          <li className="col--fifth">
            <div className="subtle-select">
              <label htmlFor="filter-groups" className="subtle-select__label">Periode:</label>

              <div className="select subtle-select__select">
                <select id="filter-measure">
                  <option selected>2014</option>
                  <option selected>2013</option>
                </select>
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
