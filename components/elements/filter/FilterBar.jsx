import React, {Component, PropTypes} from 'react'

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

  handleFilterChange(filter, newValue) {
    const {onChange} = this.props
    onChange(filter.name, newValue)

  }

  render() {
    const {filters} = this.props
    return (
      <section className="graph__filter">
        <h5 className="t-only-screenreaders">Filter</h5>
        <div className="row t-position">
          {filters.filter(f => !f.props.hidden).map(filter => (
            <div key={filter.name} className="col--fifth" style={{position: 'static'}}>
              <filter.component {...filter.props} onChange={this.handleFilterChange.bind(this, filter)}/>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
