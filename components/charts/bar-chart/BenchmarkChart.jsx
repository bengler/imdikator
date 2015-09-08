import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

export default class BenchmarkChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {

    if (!data || !data.hasOwnProperty('data') || !data.hasOwnProperty('unit')) {
      return
    }

    const svg = this.svg
    const interimSpacingFactor = 0.025
    const endMarginFactor = 0
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], interimSpacingFactor, endMarginFactor)
    x.domain(data.data.map(dataItem => dataItem.category))
    const y = d3.scale.linear().range([this.size.height, 0])

    const isPercent = data.unit === 'percent'
    if (isPercent) {
      y.domain([0, 100])
    } else {
      y.domain([0, d3.max(data.data, dataItem => dataItem.value)])
    }

    const labels = []
    // TODO: Move these colors out to CSS?
    data.data.forEach((dataItem, i) => {
      if (dataItem.highlight === true) {
        const color = 'red'
        dataItem.color = color
        const label = String(dataItem.value) + '%'
        labels.push({x: x(dataItem.category), y: y(dataItem.value), text: label, color: color})
      } else {
        dataItem.color = 'rgb(144, 165, 178)'
      }
    })

    // Draw the background color (TODO: move this out to CSS?)
    svg.append('rect')
    .attr('class', 'glanceChartBackground')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('fill', 'rgb(223, 235, 241)')

    if (isPercent) {
      // Draw the lines per 10% in the background
      const lines = d3.range(10, 100, 10)
      svg.selectAll('.line').data(lines).enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', dataItem => this.size.width)
      .attr('y1', dataItem => y(dataItem))
      .attr('y2', dataItem => y(dataItem))
      .style('stroke', 'white')
    }

    // Draw the bars
    svg.selectAll('.bar').data(data.data).enter()
    .append('rect')
    .attr('class', 'glanceBar')
    .attr('x', dataItem => x(dataItem.category))
    .attr('y', dataItem => y(dataItem.value))
    .attr('width', dataItem => x.rangeBand())
    .attr('height', dataItem => this.size.height - y(dataItem.value))
    .style('fill', dataItem => dataItem.color)

    // Draw any labels (any datapoint that has highlight === true)
    const fontSize = 14
    svg.selectAll('.label').data(labels).enter()
    .append('text')
    .attr('dx', dataItem => dataItem.x + x.rangeBand() / 2)
    .attr('dy', dataItem => dataItem.y - fontSize)
    .attr('width', dataItem => x.rangeBand())
    .style('text-anchor', 'middle')
    .style('font-size', String(fontSize) + 'px')
    .text(dataItem => dataItem.text)
    .style('fill', dataItem => dataItem.color)
  }

  render() {
    const margins = {left: 0, top: 0, right: 0, bottom: 0}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}
