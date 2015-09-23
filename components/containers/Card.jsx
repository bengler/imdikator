import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import ChartSelectorList from '../elements/ChartSelectorList'
import UnitSelection from '../elements/UnitSelection'

import {performQuery} from '../../actions/cardPages'

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    query: PropTypes.object,
    data: PropTypes.object,
    tableHeaders: PropTypes.object,
    activeTab: PropTypes.object,
    isOpen: PropTypes.boolean,
    boundUpdateCardQuery: PropTypes.func,
    dispatch: PropTypes.func
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isOpen = nextProps.isOpen
    return isOpen
  }

  handleChangeTab(newTabName) {
    this.context.goTo(`/steder/:region/:pageName/:cardName/:tabName`, {tabName: newTabName})
  }

  render() {
    const {card, activeTab, tableHeaders, query} = this.props

    if (!card) {
      return null
    }

    if (!card.tabs) {
      return null
    }

    if (!activeTab) {
      return null
    }

    let units = []
    if (tableHeaders && tableHeaders.uniqueValues) {
      units = tableHeaders.uniqueValues.enhet
    }

    let unit = null
    if (query) {
      unit = query.unit
    }

    const updateUnit = newUnit => {
      this.props.dispatch(performQuery(card, activeTab, {unit: newUnit}))
    }

    const ChartComponent = CHARTS[activeTab.chartKind]
    return (
      <div>
        <h3>{card.title}</h3>
        {(() => {
          if (this.props.isOpen == true) {
            return [
              <ChartSelectorList card={card} onSelectDataView={this.handleChangeTab.bind(this)}/>,
              <UnitSelection selectedUnit={unit} units={units} onChangeUnit={updateUnit}/>,
              <ChartComponent data={this.props.data}/>
            ]
          }
        })()}
      </div>
    )
  }
}

function select(state, ownProps) {
  const cardState = state.cardState[ownProps.card.name]

  if (!cardState) {
    return {}
  }

  const {query, activeTab, data} = cardState

  const tableHeaders = state.tableHeaders[query.tableName]
  const isOpen = state.openCards.includes(ownProps.card.name)

  return {
    isOpen,
    data,
    tableHeaders,
    activeTab,
    query
  }
}

export default connect(select)(Card)
