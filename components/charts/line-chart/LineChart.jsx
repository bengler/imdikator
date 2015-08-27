import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'


const sampleData = [{year: 2014, value: 100}, {year: 2015, value: 56}, {year: 2016, value: 69}, {year: 2017, value: 34}, {year: 2018, value: 36}, {year: 2019, value: 46}, {year: 2020, value: 65}]

/**
 * Only for development
 */
export default class LineChart extends React.Component {
  drawPoints(el, scales, data) {

    const svg = this.svg

    function getDate(year) {
      return new Date(String(year))
    }

    const g = d3.select(el).selectAll('.d3-points')

    const sampleYearRange = d3.extent(sampleData, ds => getDate(ds.year))
    const xScale = d3.time.scale()
    .domain([sampleYearRange[0], sampleYearRange[sampleYearRange.length - 1]])
    .range([0, this.size.width])

    const maxValue = d3.max(data, ds => ds.value)
    const yScale = d3.scale.linear().domain([0, maxValue]).range([this.size.height, 0])

    const yAxis = d3.svg.axis().scale(yScale).orient('left')
    svg.append('g').call(yAxis).attr('class', 'axis')

    // x axis
    const xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickFormat(d3.time.format('%Y'))
    svg.append('g').call(xAxis).attr('class', 'axis').attr('transform', 'translate(0, ' + (this.size.height) + ')')

    // This function calculates a path to draw for the line
    // For more options besides linear, see
    // https://www.dashingd3js.com/svg-paths-and-d3js
    const lineFunction = d3.svg.line()
    .x((d, i) => xScale(getDate(d.year)))
    .y((d, i) => yScale(d.value))
    .interpolate('linear')

    const point = g.selectAll('.line').data(data)
    point.enter()
      .append('path')
      .attr('class', 'line')
      .attr({
        d: lineFunction(data),
        stroke: 'blue',
        'stroke-width': 1,
        fill: 'none'
      })
    // EXIT
    point.exit().remove()
  }

  scales(el, domain) {
    // This function should scale the values for x,y depending on context
  }
  render() {
    const margins = {left: 0, top: 0, right: 0, bottom: 0}
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints} scales={this.scales} margins={margins}/>
    )
  }

}
