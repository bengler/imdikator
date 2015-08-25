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
        <p><a href="/sfdjadskfjskaldj"> Catch all!</a></p>
      </div>
    )
  }
}
