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
      <li className="tabs-menu__list-item" disabled={this.props.enabled ? '' : 'disabled'} type="button" onClick={this.props.onSelectItem}>
        <a href="#" className="tabs-menu__link">
          <i className="icon__chart-line tabs-menu__icon" />
          {title}
        </a>
      </li>
    )
  }
}
