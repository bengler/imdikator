import React, {Component, PropTypes} from 'react'
import RegionChanger from './RegionChanger'
import cx from 'classnames'
import humanizeList from 'humanize-list'
import * as ImdiPropTypes from '../../proptypes/ImdiPropTypes'

export default class FilterBar extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      props: PropTypes.any,
      component: PropTypes.func
    })),
    region: ImdiPropTypes.region.isRequired,
    onChange: PropTypes.func
  };

  static defaultProps = {
    filters: []
  };

  static visibleFilters = []

  constructor() {
    super()
    this.state = {
      expanded: false
    }
  }

  handleClick(e) {
    e.preventDefault()
    this.setState({expanded: !this.state.expanded})
    return false
  }

  handleFilterChange(filter, newValue) {
    const {onChange} = this.props
    onChange(filter.name, newValue)
  }

  listify(arr, options = {}) {
    const defaults = {oxfordComma: false, conjunction: 'og'}
    return humanizeList(arr, Object.assign({}, defaults, options))
  }

  render() {
    const {filters, region} = this.props

    const width = window.innerWidth

    const filterLimit = width > 600 ? (width > 912 ? 4 : 2) : 1 // eslint-disable-line no-nested-ternary

    let visibleFilters = filters.filter(f => !f.props.hidden)

    const toggleFilters = visibleFilters.length > filterLimit

    const toggleFiltersClasses = cx({
      'toggle__button': true,
      'toggle__button--expanded': this.state.expanded
    })

    const toggleFilterLabel = this.listify(visibleFilters.slice(filterLimit).map(filter => filter.props.label))

    if (toggleFilters) {
      if (!this.state.expanded) {
        visibleFilters = visibleFilters.slice(0, filterLimit)
      }
    }

    return (
      <div className="graph__filter" role="toolbar" aria-label="Filtreringsvalg">
        <div className="flex-row">
          <div className="col--fifth" style={{position: 'static'}}>
            <RegionChanger region={region} />
          </div>
          {visibleFilters.map(filter => (
            <div key={filter.name} className="col--fifth" style={{position: 'static'}}>
              <filter.component {...filter.props} onChange={this.handleFilterChange.bind(this, filter)} />
            </div>
          ))}
        </div>
        {toggleFilters && (
          <div className="toggle toggle--light graph__filter-toggle t-no-margin">
            <a onClick={this.handleClick.bind(this)} href="javascript:" className={toggleFiltersClasses} aria-expanded={this.state.expanded} role="button">{// eslint-disable-line no-script-url, max-len
  }
              <span className="toggle__caption--contracted">
                {toggleFilterLabel}
              </span>
              <span className="toggle__caption--expanded">Færre valg</span>
              <i className="icon__arrow-down toggle__icon" />
            </a>
          </div>
        )}
      </div>
    )
  }
}
