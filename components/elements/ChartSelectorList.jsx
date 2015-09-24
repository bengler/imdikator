import React, {Component, PropTypes} from 'react'
import ChartSelector from './ChartSelector'

export default class ChartSelectorList extends Component {
  static propTypes = {
    card: PropTypes.array,
    onSelectDataView: PropTypes.function
  }

  render() {
    const {card} = this.props
    const list = card.tabs.map(tab => {
      const buttonEnabled = true
      return (
        <ChartSelector enabled={buttonEnabled} onSelectItem={() => this.props.onSelectDataView(tab.name)} key={tab.name} title={tab.title}/>
      )
    })

    return (
        <div className="toggle-list__section-header">
          <nav className="tabs-menu tabs-menu--compact-mobile">
            <ul className="t-no-list-styles tabs-menu__list">
            {list}
            </ul>
          </nav>
        </div>
    )
  }
}
