import React, {Component, PropTypes} from 'react'
import ChartSelector from './ChartSelector'

const dataViewTypeTitleMap = {
  now: 'Nåtid',
  time: 'Over tid',
  map: 'Kart',
  compare: 'Sammenliknet',
  table: 'Tabell'
}

export default class ChartSelectorList extends Component {
  static propTypes = {
    charts: PropTypes.array,
    onSelectDataView: PropTypes.function
  }

  render() {
    const list = Object.keys(dataViewTypeTitleMap).map(key => {
      const buttonEnabled = Math.floor(Math.random() * 2) == 1
      return (
        <ChartSelector enabled={buttonEnabled} onSelectItem={() => this.props.onSelectDataView(key)} key={key} title={dataViewTypeTitleMap[key]}/>
      )
    })

    return (
        <div>
        {list}
        </div>
    )
  }
}
