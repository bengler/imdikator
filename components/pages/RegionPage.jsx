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
        <p><a href="/regions/bar?oewfasdjfk" data-history-replace="true"> Go replace state</a></p>
      </div>
    )
  }
}
