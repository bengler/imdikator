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
    disabledTabs: PropTypes.arrayOf(PropTypes.string),
    makeLinkToTab: PropTypes.func.isRequired,
    handleTabLinkClick: PropTypes.func
  };

  render() {
    const {tabs, activeTab, makeLinkToTab, handleTabLinkClick, disabledTabs} = this.props
    const links = tabs.map(tab => {

      const disabled = disabledTabs.includes(tab.name)

      const linkClassName = cx({
        'tabs-menu__link': true,
        'tabs-menu__link--current': activeTab.name === tab.name,
        'tabs-menu__link--disabled': disabled
      })

      const tabState = activeTab.name === tab.name

      const iconClassName = cx({
        'tabs-menu__icon ': true,
        [ICON_CLASS_NAMES[tab.name]]: true
      })

      const handleLinkClick = () => {
        return handleTabLinkClick(tab)
      }

      if (disabledTabs.includes(tab.name)) {
        return (
          <li key={tab.name} className="tabs-menu__list-item" role="tab">
            <span className={linkClassName}>
              <i className={iconClassName} />
              {tab.title}
            </span>
          </li>
        )
      }

      return (
        <li title={tab.title} key={tab.name} className="tabs-menu__list-item" role="tab" aria-selected={tabState}>
          <a href={makeLinkToTab(tab)} className={linkClassName} onClick={handleLinkClick} data-keep-scroll-position>
            <i className={iconClassName} />
            {tab.title}
          </a>
        </li>
      )
    })

    return (
      <div className="toggle-list__section-header">
        <nav className="tabs-menu tabs-menu--compact-mobile">
          <ul className="t-no-list-styles tabs-menu__list" role="tablist">
            {links}
          </ul>
        </nav>
      </div>
    )
  }
}
