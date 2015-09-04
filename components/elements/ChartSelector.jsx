import React, {Component, PropTypes} from 'react'

export default class ChartSelector extends Component {
  static propTypes = {
    title: PropTypes.string,
    onSelectItem: PropTypes.function,
    enabled: PropTypes.boolean
  }

  render() {
    const {title} = this.props
    return (
      <button disabled={this.props.enabled ? '' : 'disabled'} className="chart" type="button" onClick={this.props.onSelectItem}>{title}</button>
    )
  }
}
