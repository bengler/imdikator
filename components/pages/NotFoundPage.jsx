import React, {Component, PropTypes} from 'react'

export default class NotFoundPage extends Component {
  static propTypes = {
    route: PropTypes.object
  }

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props.route, null, 2)}</pre>
        Not found!!
      </div>
    )
  }
}
