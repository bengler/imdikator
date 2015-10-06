import React from 'react'
import {findDOMNode} from 'react-dom'
import Chart from './_d3chart'
import EventEmitter from 'events'
import Hoverbox from '../elements/Hoverbox'

/**
 * Only for development
 */
export default class D3Chart extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    data: React.PropTypes.object,
    drawPoints: React.PropTypes.func,
    margins: React.PropTypes.object
  }

  componentDidMount() {

    this.eventEmitter = new EventEmitter()
    this.eventEmitter.on('datapoint:hover', state => {
      const el = findDOMNode(this)
      this.refs.focus.setState({
        title: state.title,
        body: state.body,
        el: state.el,
        containerRect: el.getBoundingClientRect()
      })
    })

    const el = findDOMNode(this)
    this.chart = new Chart(el, {
      width: '100%',
      height: '100%'
    }, this.getChartState(), this.props.drawPoints, this.props.margins, this.eventEmitter)
  }

  componentDidUpdate() {
    const el = findDOMNode(this)
    this.chart.update(el, this.getChartState())
  }

  componentWillUnmount() {
    this.eventEmitter.removeAllListeners()
    const el = findDOMNode(this)
    this.chart.destroy(el)
  }

  getChartState() {
    return {
      data: this.props.data
    }
  }

  render() {
    const classes = ['chart', this.props.className].join(' ')
    return (
      <div className={classes}>
        <Hoverbox ref="focus"/>
      </div>
    )
  }
}
