import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [10, 15, 5, 30]

export default class BarChart extends React.Component {
  drawPoints(el, scales, data) {

    const width  = el.offsetWidth
    const height = el.offsetHeight

    // Make scaling functions for x-position and height
    // domain is the range of input data and the range is the mapping range for a value
    // within that domain
    const xPos = d3.scale.linear().domain([0, sampleData.length]).range([0, width])
    const hVal = d3.scale.linear().domain([0, d3.max(sampleData)]).range([0, height])
     
    const padding = 10

    const g = d3.select(el).selectAll('.d3-points')
    const point = g.selectAll('.bar').data(data)
    point.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr({
        x: (d, i) => xPos(i),
        y: d => el.offsetHeight - hVal(d),
        height: d => hVal(d),
        width: (d, i) => xPos(1) - padding
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
