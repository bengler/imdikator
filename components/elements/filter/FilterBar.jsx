import React, {Component, PropTypes} from 'react'
import RegionChanger from './RegionChanger'
import throttle from '../../utils/throttle'
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
      expanded: false,
      windowWidth: window.innerWidth
    }
  }

  handleResize = throttle(() => {
    this.setState({windowWidth: window.innerWidth})
  }, 200)

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleClick(event) {
    event.preventDefault()
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

    const filterLimit = this.state.windowWidth > 720 ? (this.state.windowWidth > 912 ? 5 : 3) : 2 // eslint-disable-line no-nested-ternary

    let visibleFilters = filters.filter(f => !f.props.hidden)

    const toggleFilters = visibleFilters.length > filterLimit

    const toggleFiltersClasses = cx({
      'toggle__button': true,
      'toggle__button--expanded': this.state.expanded
    })

    const toggleFilterLabel = this.listify(visibleFilters.slice(filterLimit - 1).map(filter => filter.props.label))

    if (toggleFilters) {
      if (!this.state.expanded) {
        visibleFilters = visibleFilters.slice(0, filterLimit - 1)
      }
    }

    return (
      <div className="graph__filter" role="toolbar" aria-label="Filtreringsvalg" style={{position: 'relative'}}>
        <div className="flex-row">
          <div className="col--six" style={{position: 'static'}}>
            <RegionChanger region={region} />
          </div>
          {visibleFilters.map(filter => (
            <div key={filter.name} className="col--six" style={{position: 'static'}}>
              <filter.component {...filter.props} onChange={this.handleFilterChange.bind(this, filter)} />
            </div>
          ))}
          {toggleFilters && (
            <div key={toggleFilterLabel} className="col--six col--align-bottom">
              <div className="toggle toggle--light">
                <a onClick={this.handleClick.bind(this)} href="javascript:" className={toggleFiltersClasses} aria-expanded={this.state.expanded} role="button" title={toggleFilterLabel}>{// eslint-disable-line no-script-url, max-len
            }
                  <span className="toggle__caption--contracted">
                    Vis flere filtre
                  </span>
                  <span className="toggle__caption--expanded">Vis færre filtre</span>
                  <i className="icon__arrow-down toggle__icon" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
