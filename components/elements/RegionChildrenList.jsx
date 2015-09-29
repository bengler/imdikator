import React, {Component, PropTypes} from 'react'

export default class RegionChildrenList extends Component {
  static propTypes = {
    children: PropTypes.array
  }

  render() {
    return (
      <nav role="navigation" className="navigation">
        <ul className="t-no-list-styles">
          {this.props.children.map(region => {
            return <li key={region.code} className="col--third col--flow col--right-padding"><a className="navigation__link" href="#">{region.name}</a></li>
          })}
        </ul>
      </nav>
    )
  }
}
