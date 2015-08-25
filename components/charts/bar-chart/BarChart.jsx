import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [10, 15, 5, 30]

export default class BarChart extends React.Component {
  drawPoints(el, scales, data) {

    const width  = el.offsetWidth
    const height = el.offsetHeight

    const axisPadding = 25

    // Make scaling functions for x-position and height domain is the range of
    // input data and the range is the mapping range for a value within that
    // domain
    const xPos = d3.scale.linear().domain([0, data.length]).range([axisPadding + 5, width - axisPadding - 5])
    // coordinates for Y axis is 0 top, `height` bottom so we invert the range
    const yPos = d3.scale.linear().domain([0, d3.max(data)]).range([height - axisPadding, 0])
    // Each bar will scale so the maximum value takes up the full height
    const hVal = d3.scale.linear().domain([0, d3.max(data)]).range([0, height - axisPadding])

    const padding = 10

    const svg = d3.select(el).select('svg')

    // y axis
    const yAxis = d3.svg.axis().scale(yPos).orient('left') // .ticks(data.length)
    svg.append('g').call(yAxis).attr('class', 'axis').attr('transform', 'translate(' + axisPadding + ',0)')

    // x axis
    const xAxis = d3.svg.axis().scale(xPos).orient('bottom')
    svg.append('g').call(xAxis).attr('class', 'axis').attr('transform', 'translate(0, ' + (height - axisPadding) + ')')

    const g = d3.select(el).selectAll('.d3-points')
    const point = g.selectAll('.bar').data(data)
    point.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr({
        x: (d, i) => xPos(i),
        y: (d, i) => yPos(d),
        height: d => hVal(d),
        width: (d, i) => xPos(1) - (padding * 5)
      })
    point.exit().remove()
  }

  // Not using this func here
  scales(el, domain) {
  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints} scales={this.scales}/>
    )
  }

}
