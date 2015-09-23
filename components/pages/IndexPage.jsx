import React, {Component, PropTypes} from 'react'
import Search from '../containers/Search'

export default class RegionPage extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  render() {
    return (
      <div>
        IndexPage
        <pre>{JSON.stringify(this.props.route, null, 2)}</pre>
        <a href="/steder/k0301-Oslo/befolkning/befolkning_hovedgruppe/latest">/k0301-Oslo/befolkning/befolkning_hovedgruppe/latest</a>
        <Search/>
        <br/>
        <br/>
      </div>
    )
  }
}
