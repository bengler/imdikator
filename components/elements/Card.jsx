import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import ChartSelectorList from './ChartSelectorList'
import {fetchSampleData} from './../../actions/cards'

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    data: PropTypes.object,
    current: PropTypes.boolean,
    fetchSampleData: PropTypes.function
  }

  componentWillMount() {
    if (this.props.current) {
      this.props.fetchSampleData(this.props.card.name, 'now')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.current
  }

  render() {
    const ChartComponent = CHARTS[this.props.card.chartKind]
    return (
      <div>
        <h3>{this.props.card.title}</h3>
         {(() => {
           if (this.props.current == true) {
             return [
               <ChartSelectorList/>,
               <ChartComponent data={this.props.data}/>
             ]
           }
         })()}
         {!this.props.current
           && <a href={this.props.card.name}>Expand</a>
         }
      </div>
    )
  }
}

function select(state, ownProps) {
  let result = null
  if (state.sampleData.hasOwnProperty(ownProps.card.name)) {
    result = state.sampleData[ownProps.card.name]
  }
  return {data: result}
}

function actions(dispatch) {
  return {
    fetchSampleData: (cardName, sampleDataName) => fetchSampleData(cardName, sampleDataName)(dispatch)
  }
}

// This is the default implementation of mergeProps, included here for informational purposed
function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(select, actions, mergeProps)(Card)
