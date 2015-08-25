import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [23, 67, 23, 99, 98, 43, 51, 42, 16, 14, 75, 77, 88, 77, 85, 68, 88, 16, 28, 61, 41, 66, 75, 94, 3, 19, 42, 39, 10, 18, 9, 80, 1, 4, 1, 85, 59, 78, 88, 7, 36, 21, 77, 84, 69, 12, 23, 65, 87, 94, 20, 47, 86, 20, 59, 39, 5, 78, 3, 83, 97, 27, 26, 71, 4, 1, 7, 58, 45, 56, 80, 16, 15, 94, 44, 85, 14, 37, 7, 96, 20, 92, 93, 33, 92, 89, 78, 4, 68, 60, 81, 71, 1, 21, 20, 46, 32, 73, 11, 13]

/**
 * Only for development
 */
export default class LineChart extends React.Component {
  drawPoints(el, scales, data) {

    const g = d3.select(el).selectAll('.d3-points')

    // This function calculates a path to draw for the line
    // For more options besides linear, see
    // https://www.dashingd3js.com/svg-paths-and-d3js
    const lineFunction = d3.svg.line()
      .x((d, i) => i * 10) // Should use .scales
      .y(d => d)
      .interpolate('linear')

    const point = g.selectAll('.line').data(data)
    point.enter()
      .append('path')
      .attr('class', 'line')
      .attr({
        d: lineFunction(data),
        stroke: 'black',
        'stroke-width': 1,
        fill: 'none'
      })

    //// ENTER & UPDATE
    //point.attr('cx', function (d) {
    //  return scales.x(d.x)
    //})
    //  .attr('cy', function (d) {
    //    return scales.y(d.y)
    //  })
    //  .attr('r', function (d) {
    //    return scales.z(d.z)
    //  })

    // EXIT
    point.exit().remove()
  }

  scales(el, domain) {
    // This function should scale the values for x,y depending on context
  }
  render() {
    return (
      <D3Chart data={sampleData} domain={{x: [0, 30], y: [0, 100]}} drawPoints={this.drawPoints} scales={this.scales}/>
    )
  }

}
