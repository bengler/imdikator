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
        <a href="/regions/m0101-Halden/utdanning/befolkninggr2">Go to halden => utdanning => befolkninggr2</a>
        <p><a href="/regions/foo"> Go to region</a></p>
        <p><a href="/regions/foo?no=no"> Go to region (w / query)</a></p>
        <p><a href="/sfdjadskfjskaldj"> Not found - Catch all route!</a></p>
        <h2>Try some charts</h2>
        <p><a href="/debug/charts/">CHARTS!</a></p>
        <p><a href="/doc/">Documentation</a></p>
        <a onClick={this.handleClick}>No href (just for testing react-a11y)</a>
      </div>
    )
  }
}
