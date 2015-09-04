import React, {Component, PropTypes} from 'react'

export default class RegionPage extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  render() {
    return (
      <div>
        RegionPage
        <pre>{JSON.stringify(this.props.route, null, 2)}</pre>
        <p><a href="/"> Go back</a></p>
      </div>
    )
  }
}
