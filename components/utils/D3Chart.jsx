import React from 'react'
import {findDOMNode} from 'react-dom'
import Chart from './_d3chart'
import EventEmitter from 'events'
import Hoverbox from '../elements/Hoverbox'

export default class D3Chart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    className: React.PropTypes.string,
    data: React.PropTypes.object,
    functions: React.PropTypes.object,
    config: React.PropTypes.object
  }
  /* eslint-enable react/forbid-prop-types */

  componentDidMount() {

    this.eventEmitter = new EventEmitter()
    this.eventEmitter.on('datapoint:hover-in', state => {
      const el = findDOMNode(this)
      this.refs.focus.setState({
        title: state.title,
        body: state.body,
        el: state.el,
        containerRect: el.getBoundingClientRect()
      })
    })

    this.eventEmitter.on('datapoint:hover-out', () => {
      this.refs.focus.setState({
        el: null
      })
    })

    const el = findDOMNode(this)
    this.chart = new Chart(el, {
      width: '100%',
      height: '100%'
    }, this.getChartState(), this.props.functions, this.config())
  }

  componentDidUpdate() {
    const el = findDOMNode(this)
    this.chart.update(el, this.getChartState(), this.config())
  }

  componentWillUnmount() {
    this.eventEmitter.removeAllListeners()
    const el = findDOMNode(this)
    this.chart.destroy(el)
  }

  config() {
    return Object.assign({
      eventEmitter: this.eventEmitter,
      shouldCalculateMargins: false
    }, this.props.config)
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
