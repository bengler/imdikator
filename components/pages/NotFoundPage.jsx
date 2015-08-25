import React, {Component, PropTypes} from 'react'

export default class NotFoundPage extends Component {
  static contextTypes = {
    location: PropTypes.object
  }

  render() {
    return (
      <div>
        Not found!!
      </div>
    )
  }
}
