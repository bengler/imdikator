import React, {PropTypes} from 'react'

export default class TablePresenter {
  static propTypes = {
    foo: PropTypes.string
  }

  render() {
    return <div>Value of prop foo: {this.props.foo}</div>
  }
}
