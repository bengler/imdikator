import React from 'react'
import d3Chart from './_d3chart'

/**
 * Only for development
 */
export default class D3Chart extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    domain: React.PropTypes.object,
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
      domain: this.props.domain
    }
  }

  render() {
    return (
      <div className="chart"/>
    )
  }
}
