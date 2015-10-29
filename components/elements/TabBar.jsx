import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

const ICON_CLASS_NAMES = {
  latest: 'icon__chart-bars',
  chronological: 'icon__chart-line',
  map: 'icon__location',
  benchmark: 'icon__chart-set',
  table: 'icon__table'
}

export default class TabBar extends Component {
  static propTypes = {
    activeTab: PropTypes.object,
    tabs: PropTypes.array.isRequired,
    disabledTabs: PropTypes.array,
    makeLinkToTab: PropTypes.func.isRequired
  }

  render() {
    const {tabs, activeTab, makeLinkToTab, disabledTabs} = this.props

    const links = tabs.map(tab => {

      const disabled = disabledTabs.includes(tab.name)

      const linkClassName = cx({
        'tabs-menu__link': true,
        'tabs-menu__link--current': activeTab.name === tab.name,
        'tabs-menu__link--disabled': disabled
      })

      const iconClassName = cx({
        'tabs-menu__icon ': true,
        [ICON_CLASS_NAMES[tab.name]]: true
      })

      if (disabledTabs.includes(tab.name)) {
        return (
          <li key={tab.name} className="tabs-menu__list-item">
            <span className={linkClassName}>
            <i className={iconClassName}></i>
            {tab.title}
            </span>
          </li>
        )
      }

      return (
        <li title={tab.title} key={tab.name} className="tabs-menu__list-item">
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
