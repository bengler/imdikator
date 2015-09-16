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
        <a href="/regions/k0301-Oslo/befolkning/befolkning_hovedgruppe">/k0301-Oslo/befolkning/befolkning_hovedgruppe</a>
        <br/>
        <br/>
      </div>
    )
  }
}
