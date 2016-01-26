import React from 'react'
import {findDOMNode} from 'react-dom'
import Chart from './_d3chart'
import EventEmitter from 'events'
import Hoverbox from '../elements/Hoverbox'

export default class D3Chart extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    data: React.PropTypes.object,
    functions: React.PropTypes.object,
    config: React.PropTypes.object
  };

  componentDidMount() {

    this.eventEmitter = new EventEmitter()
    this.eventEmitter.on('datapoint:hover-in', state => {
      const el = findDOMNode(this)
      const boundingRect = el.getBoundingClientRect()
      const rect = {
        top: boundingRect.top,
        right: boundingRect.right,
        bottom: boundingRect.bottom,
        left: boundingRect.left - el.scrollLeft * 2,
        height: boundingRect.height,
        width: boundingRect.width
      }
      rect.left += el.scrollLeft
      this.refs.focus.setState({
        title: state.title,
        body: state.body,
        el: state.el,
        containerRect: rect
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

    this.resizeFunction = () => {
      this.resizeThrottler()
    }
    window.addEventListener('resize', this.resizeFunction, false)
  }

  componentDidUpdate() {
    const el = findDOMNode(this)
    this.chart.update(el, this.getChartState(), this.config())
  }

  componentWillUnmount() {
    this.eventEmitter.removeAllListeners()
    if (this.resizeFunction) {
      window.removeEventListener('resize', this.resizeFunction, false)
    }
    const el = findDOMNode(this)
    this.chart.destroy(el)
  }

  resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!this.resizeTimeout) {
      this.resizeTimeout = setTimeout(() => {
        this.resizeTimeout = null
        const el = findDOMNode(this)
        if (el) {
          this.chart.update(el, this.getChartState(), this.config())
        }
      }, 66) // 15 fps (1000 / 15)
    }
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
