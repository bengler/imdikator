import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {CHARTS} from '../../config/chartTypes'
import ChartSelectorList from './ChartSelectorList'

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    current: PropTypes.boolean
  }

  render() {
    const chartType = 'bar'
    const ChartComponent = CHARTS[chartType]
    return (
      <div>
        <h3>{this.props.card.title}</h3>
         {(() => {
           if (this.props.current == true) {
             return [
               <ChartSelectorList/>,
               <ChartComponent/>
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

export default connect()(Card)
