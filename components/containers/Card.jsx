import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import ChartSelectorList from '../elements/ChartSelectorList'
import UnitSelection from '../elements/UnitSelection'

import {updateCardQuery} from '../../actions/cards'

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    query: PropTypes.object,
    data: PropTypes.object,
    table: PropTypes.object,
    isOpen: PropTypes.boolean,
    activeTabName: PropTypes.string,
    boundUpdateCardQuery: PropTypes.func
  }

  static contextTypes = {
    linkTo: PropTypes.func
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isOpen = nextProps.isOpen
    return isOpen
  }

  render() {
    const {card, activeTabName, table, query} = this.props

    if (!card) {
      return null
    }

    if (!card.tabs) {
      return null
    }

    const activeTab = card.tabs.find(tab => tab.name == activeTabName) || card.tabs[0]

    let units = []
    if (table && table.uniqueValues) {
      units = table.uniqueValues.enhet
    }

    let unit = null
    if (query) {
      unit = query.unit
    }

    const updateUnit = newUnit => {
      const newQuery = Object.assign({}, this.props.query, {
        unit: newUnit
      })
      this.props.boundUpdateCardQuery(newQuery)
    }

    const ChartComponent = CHARTS[activeTab.chartKind]
    return (
      <div>
        <h3>{card.title}</h3>
        {(() => {
          if (this.props.isOpen == true) {
            return [
              <ChartSelectorList card={card}/>,
              <UnitSelection selectedUnit={unit} units={units} onChangeUnit={updateUnit}/>,
              <ChartComponent data={this.props.data}/>
            ]
          }
        })()}
        {!this.props.isOpen
        && <a href={this.context.linkTo('/steder/:region/:pageName/:cardName', {cardName: card.name})}>Expand</a>
        }
      </div>
    )
  }
}

function select(state, ownProps) {
  const data = state.queryResult[ownProps.card.name]
  const table = state.tables[ownProps.card.query.tableName]
  const query = state.queries[ownProps.card.name]
  const isOpen = state.openCards.includes(ownProps.card.name)

  return {
    isOpen,
    data,
    table,
    query,
    activeTabName: state.activeTabName
  }
}

function actions(dispatch, ownProps) {
  return {
    boundUpdateCardQuery: query => dispatch(updateCardQuery(ownProps.card.name, query))
  }
}

// This is the default implementation of mergeProps, included here for informational purposed
function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(select, actions, mergeProps)(Card)
