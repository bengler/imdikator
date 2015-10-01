import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

const ICON_CLASS_NAMES = {
  latest: 'icon__chart-bars',
  chronological: 'icon__chart-line',
  map: 'icon__location',
  benchmark: 'icon__stack',
  table: 'icon__file'
}

export default class TabBar extends Component {
  static propTypes = {
    activeTab: PropTypes.object,
    card: PropTypes.array.isRequired,
    makeLinkToTab: PropTypes.func.isRequired
  }

  render() {
    const {card, activeTab, makeLinkToTab} = this.props

    const links = card.tabs.map(tab => {

      const linkClassName = cx({
        'tabs-menu__link': true,
        'tabs-menu__link--current': activeTab === tab
      })

      const iconClassName = cx({
        'tabs-menu__icon ': true,
        [ICON_CLASS_NAMES[tab.name]]: true
      })

      return (
        <li className="tabs-menu__list-item">
          <a href={makeLinkToTab(tab)} className={linkClassName}>
            <i className={iconClassName}></i>
            {tab.title}
          </a>
        </li>
      )
    })

    return (
      <div className="toggle-list__section-header">
        <nav className="tabs-menu tabs-menu--compact-mobile">
          <ul className="t-no-list-styles tabs-menu__list">
            {links}
          </ul>
        </nav>
      </div>
    )
  }
}