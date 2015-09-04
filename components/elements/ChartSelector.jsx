import React, {Component, PropTypes} from 'react'
import {CHARTS} from '../../config/chartTypes'

export default class ChartSelector extends Component {
  static propTypes = {
    title: PropTypes.oneOf(Object.keys(CHARTS)),
    onSelectItem: PropTypes.function
  }

  render() {
    const {title} = this.props
    return (
      <span><a role="button" onClick={this.props.onSelectItem}>{title}</a> | </span>
    )
  }
}
