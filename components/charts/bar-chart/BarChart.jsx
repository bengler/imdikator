import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [10, 15, 5, 30]

/**
 * Only for development
 */
export default class BarChart extends React.Component {
  drawPoints(el, scales, data) {

    const g = d3.select(el).selectAll('.d3-points')

    const point = g.selectAll('.bar')
      .data(data)

    point.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr({
        x: (d, i) => i * 12,
        y: d => 200 - d,
        height: d => d,
        width: 10
      })
    .style('fill', 'blue')

    // EXIT
    point.exit().remove()
  }

  scales(el, domain) {
    if (!domain) {
      return null
    }

    const width = el.offsetWidth
    const height = el.offsetHeight

    const x = d3.scale.linear()
      .range([0, width])
      .domain(domain.x)

    const y = d3.scale.linear()
      .range([height, 0])
      .domain(domain.y)

    const z = d3.scale.linear()
      .range([5, 20])
      .domain([1, 10])

    return {x: x, y: y, z: z}
  }
  render() {
    return (
      <D3Chart data={sampleData} domain={{x: [0, 30], y: [0, 100]}} drawPoints={this.drawPoints} scales={this.scales}/>
    )
  }

}
