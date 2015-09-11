import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import ChartSelectorList from '../elements/ChartSelectorList'
import UnitSelection from '../elements/UnitSelection'

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    data: PropTypes.object,
    table: PropTypes.object,
    isOpen: PropTypes.boolean,
    fetchSampleData: PropTypes.function
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isOpen
  }

  render() {
    const ChartComponent = CHARTS[this.props.card.chartKind]
    let units = []
    if (this.props.table) {
      units = this.props.table.uniqueValues.enhet
    }
    return (
      <div>
        <h3>{this.props.card.title}</h3>
        {(() => {
          if (this.props.isOpen == true) {
            return [
              <ChartSelectorList/>,
              <UnitSelection units={units}/>,
              <ChartComponent data={this.props.data} dimensions={this.props.card.dimensions} unit={"personer"}/>
            ]
          }
        })()}
        {!this.props.isOpen
        && <a href={this.props.card.name}>Expand</a>
        }
      </div>
    )
  }
}

function select(state, ownProps) {
  let data = null
  if (state.queryResult.hasOwnProperty(ownProps.card.name)) {
    data = state.queryResult[ownProps.card.name]
  }
  let table = null
  if (state.tables.hasOwnProperty(ownProps.card.table)) {
    table = state.tables[ownProps.card.table]
  }
  return {
    isOpen: state.openCards.includes(ownProps.card.name),
    data,
    table
  }
}

function actions(dispatch) {
  return {
  }
}

// This is the default implementation of mergeProps, included here for informational purposed
function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(select, actions, mergeProps)(Card)
