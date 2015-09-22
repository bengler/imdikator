import React from 'react'
import Chart from './_d3chart'

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
    const el = React.findDOMNode(this)
    this.chart = new Chart(el, {
      width: '100%',
      height: '100%'
    }, this.getChartState(), this.props.drawPoints, this.props.margins)
  }

  componentDidUpdate() {
    const el = React.findDOMNode(this)
    this.chart.update(el, this.getChartState())
  }

  componentWillUnmount() {
    const el = React.findDOMNode(this)
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
      <div className={classes}/>
    )
  }
}
