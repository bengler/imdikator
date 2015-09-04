import React, {Component, PropTypes} from 'react'
import {CHARTS} from '../../config/chartTypes'
import ChartSelectorList from './ChartSelectorList'

/**
 * This is where the magic happens
 */
export default class TablePresenter extends Component {
  static propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
    chart: PropTypes.string,
    onSelectDataView: PropTypes.function
  }

  render() {
    const ChartComponent = CHARTS[this.props.chart]
    const {title} = this.props
    return (
      <section className="feature feature--list">
        <div className="col-block-bleed feature__box">
          <div className="feature__content-wrapper">
            <h1 className="feature__prefix">{title}</h1>
            <ChartSelectorList onSelectDataView={this.props.onSelectDataView}/>
            <ChartComponent data={this.props.data}/>
          </div>
        </div>
      </section>
    )
  }
}
