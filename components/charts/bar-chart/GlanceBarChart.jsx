import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [
  {category: '1990', series: 'Menn', value: 10},
  {category: '1991', series: 'Menn', value: 15},
  {category: '1992', series: 'Menn', value: 20},
  {category: '1993', series: 'Menn', value: 40},
  {category: '1994', series: 'Menn', value: 50},
  {category: '1995', series: 'Menn', value: 60, highlight: true},
  {category: '1996', series: 'Menn', value: 65},
  {category: '1997', series: 'Menn', value: 70},
  {category: '1998', series: 'Menn', value: 85},
  {category: '1999', series: 'Menn', value: 90},
  {category: '2000', series: 'Menn', value: 95},
]

export default class GlanceBarChart extends React.Component {
  drawPoints(el, data) {

    const svg = this.svg
    const interimSpacingFactor = 0.025
    const endMarginFactor = 0
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], interimSpacingFactor, endMarginFactor)
    x.domain(data.map(d => d.category))
    const y = d3.scale.linear().range([this.size.height, 0])
    y.domain([0, 100])

    const labels = []

    // TODO: Move these colors out to CSS?
    data.forEach((d, i) => {
      if (d.highlight === true) {
        const color = 'red'
        d.color = color
        const label = String(d.value) + '%'
        labels.push({x: x(d.category), y: y(d.value), text: label, color: color})
      } else {
        d.color = 'rgb(144, 165, 178)'
      }
    })

    // Draw the background color (TODO: move this out to CSS?)
    svg.append('rect')
    .attr('class', 'glanceChartBackground')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('fill', 'rgb(223, 235, 241')

    // Draw the lines per 10% in the background
    const lines = d3.range(10, 100, 10)
    svg.selectAll('.line').data(lines).enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', d => this.size.width)
    .attr('y1', d => y(d))
    .attr('y2', d => y(d))
    .style('stroke', 'white')

    // Draw the bars
    svg.selectAll('.bar').data(data).enter()
    .append('rect')
    .attr('class', 'glanceBar')
    .attr('x', d => x(d.category))
    .attr('y', d => y(d.value))
    .attr('width', d => x.rangeBand())
    .attr('height', d => this.size.height - y(d.value))
    .style('fill', d => d.color)

    // Draw any labels (any datapoint that has highlight === true)
    const fontSize = 14
    svg.selectAll('.label').data(labels).enter()
    .append('text')
    .attr('dx', d => d.x + x.rangeBand() / 2)
    .attr('dy', d => d.y - fontSize)
    .attr('width', d => x.rangeBand())
    .style('text-anchor', 'middle')
    .style('font-size', String(fontSize) + 'px')
    .text(d => d.text)
    .style('fill', d => d.color)
  }

  render() {
    const margins = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}

