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
        <div>
        {list}
        </div>
    )
  }
}
