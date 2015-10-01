import React, {Component, PropTypes} from 'react'
import {prefixify} from '../../lib/regionUtil'

export default class RegionChildrenList extends Component {

  static propTypes = {
    children: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func
  }

  render() {
    return (
      <nav role="navigation" className="navigation">
        <ul className="t-no-list-styles">
          {this.props.children.map(region => {
            return (
            <li key={region.code} className="col--third col--flow col--right-padding">
              <a className="navigation__link" href={this.context.linkTo('/steder/:region', {region: prefixify(region)})}>{region.name}</a>
            </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}
