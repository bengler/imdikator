import React, {Component, PropTypes} from 'react'

export default class RegionPage extends Component {
  static contextTypes = {
    location: PropTypes.object
  }

  render() {
    return (
      <div>
        IndexPage
        <pre>{JSON.stringify(this.props.route, null, 2)}</pre>
        <p><a href="/regions/foo"> Go to region</a></p>
        <p><a href="/regions/foo?no=no"> Go to region (w / query)</a></p>
        <p><a href="/sfdjadskfjskaldj"> Not found - Catch all route!</a></p>
        <h2>Try some charts</h2>
        <p><a href="/debug/charts/">CHARTS!</a></p>
      </div>
    )
  }
}
