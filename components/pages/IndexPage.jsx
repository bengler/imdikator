import React, {Component, PropTypes} from 'react'

export default class RegionPage extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  render() {
    return (
      <div>
        IndexPage
        <pre>{JSON.stringify(this.props.route, null, 2)}</pre>
        <a href="/steder/k0301-Oslo/befolkning/befolkning_hovedgruppe/naatid">/k0301-Oslo/befolkning/befolkning_hovedgruppe/naatid</a>
        <br/>
        <br/>
      </div>
    )
  }
}
