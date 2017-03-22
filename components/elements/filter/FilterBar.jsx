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
      'toggle__button': true, // eslint-disable-line camelcase
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
        <div className="flex-row t-position">
          {visibleFilters.map(filter => (
            <div key={filter.name} className="col--fifth" style={{position: 'static'}}>
              <filter.component {...filter.props} onChange={this.handleFilterChange.bind(this, filter)} />
            </div>
          ))}
        </div>
        {toggleFilters && (
          <div className="toggle toggle--light t-no-margin">
            <div className="toggle toggle--light t-no-margin">
              <a onClick={this.handleClick.bind(this)} href="javascript:" className={toggleFiltersClasses}>{// eslint-disable-line no-script-url
  }
                <span className="toggle__caption--contracted">
                  Vis flere ({toggleFilterLabel})
                </span>
                <span className="toggle__caption--expanded">Færre filtre</span>
                <i className="icon__arrow-down toggle__icon" />
              </a>
            </div>
          </div>
        )}
      </div>
    )
  }
}
