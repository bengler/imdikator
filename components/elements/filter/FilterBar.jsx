import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import humanizeList from 'humanize-list'

export default class FilterBar extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      props: PropTypes.any,
      component: PropTypes.func
    })),
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
    //if (!this.state.expanded) {
      //this.props.dispatch(trackHelpOpen())
    //}
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
    const {filters} = this.props

    const filterLimit = 5

    let visibleFilters = filters.filter(f => !f.props.hidden)

    const toggleFilters = visibleFilters.length > filterLimit

    const toggleFiltersClasses = cx({
      'subtle-select__button': true,
      'subtle-select__button--toggle': true,
      'subtle-select__select--toggle-hide': this.state.expanded
    })

    const toggleFilterLabel = this.listify(visibleFilters.slice(filterLimit - 1).map(filter => filter.props.label))

    if (toggleFilters) {
      if (!this.state.expanded) {
        visibleFilters = visibleFilters.slice(0, filterLimit - 1)
      }
    }

    return (
      <div className="graph__filter" role="toolbar" aria-label="Filtreringsvalg">
        <div className="row t-position">
          {visibleFilters.map(filter => (
            <div key={filter.name} className="col--fifth" style={{position: 'static'}}>
              <filter.component {...filter.props} onChange={this.handleFilterChange.bind(this, filter)} />
            </div>
          ))}
          {toggleFilters && (
            <div key="toggleFilters" className="col--fifth" style={{position: 'static'}}>
              <div className="subtle-select">
                <label>
                  <span className="subtle-select__label">
                    {toggleFilterLabel}:
                  </span>
                  <button type="button" className={toggleFiltersClasses} onClick={this.handleClick.bind(this)}>
                    {this.state.expanded && ('Skjul filtre')}
                    {!this.state.expanded && ('Vis filtre')}
                  </button>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
