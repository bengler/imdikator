import React from 'react'
import d3Chart from './_d3chart'

/**
 * Only for development
 */
export default class D3Chart extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    data: React.PropTypes.array,
    dimensions: React.PropTypes.array,
    unit: React.PropTypes.string,
    drawPoints: React.PropTypes.func,
    margins: React.PropTypes.object
  }

  componentDidMount() {
    const el = React.findDOMNode(this)
    d3Chart.create(el, {
      width: '100%',
      height: '100%'
    }, this.getChartState(), this.props.drawPoints, this.props.margins)
  }

  componentDidUpdate() {
    const el = React.findDOMNode(this)
    d3Chart.update(el, this.getChartState())
  }

  componentWillUnmount() {
    const el = React.findDOMNode(this)
    d3Chart.destroy(el)
  }

  getChartState() {
    return {
      data: this.props.data,
      dimensions: this.props.dimensions,
      unit: this.props.unit,
    }
  }

  render() {
    const classes = ['chart', this.props.className].join(' ')
    return (
      <div className={classes}/>
    )
  }
}
