import React, {Component, PropTypes} from 'react'

export default class ChartSelector extends Component {
  static propTypes = {
    title: PropTypes.string,
    onSelectItem: PropTypes.function,
    enabled: PropTypes.boolean,
    indexInList: PropTypes.integer
  }

  render() {
    const {title} = this.props
    const iconClassNames = ['icon__chart-bars', 'icon__chart-line', 'icon__stack', 'icon__location', 'icon__file']
    const iconClasses = 'tabs-menu__icon ' + iconClassNames[this.props.indexInList]

    return (
      <li className="tabs-menu__list-item" disabled={this.props.enabled ? '' : 'disabled'} type="button" onClick={this.props.onSelectItem}>
        <a href="#" className="tabs-menu__link">
          <i className={iconClasses}></i>
          {title}
        </a>
      </li>
    )
  }
}
