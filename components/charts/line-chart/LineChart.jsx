import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [
  {category: '1990', series: 'Menn', value: 10},
  {category: '1990', series: 'Kvinner', value: 8},
  {category: '1991', series: 'Menn', value: 15},
  {category: '1991', series: 'Kvinner', value: 10},
  {category: '1992', series: 'Menn', value: 20},
  {category: '1992', series: 'Kvinner', value: 15},
  {category: '1993', series: 'Menn', value: 40},
  {category: '1993', series: 'Kvinner', value: 25},
  {category: '1994', series: 'Menn', value: 50},
  {category: '1994', series: 'Kvinner', value: 25},
  {category: '1995', series: 'Menn', value: 60},
  {category: '1995', series: 'Kvinner', value: 35},
  {category: '1996', series: 'Menn', value: 65},
  {category: '1996', series: 'Kvinner', value: 40},
  {category: '1997', series: 'Menn', value: 70},
  {category: '1997', series: 'Kvinner', value: 55},
  {category: '1998', series: 'Menn', value: 85},
  {category: '1998', series: 'Kvinner', value: 70},
  {category: '1999', series: 'Menn', value: 90},
  {category: '1999', series: 'Kvinner', value: 80},
  {category: '2000', series: 'Menn', value: 100},
  {category: '2000', series: 'Kvinner', value: 90}
]

export default class LineChart extends React.Component {
  drawPoints(el, data) {
    const svg = this.svg

    const parseDate = d3.time.format('%Y').parse
    const formatPercent = d3.format('%')

    const x = d3.time.scale().range([0, this.size.width])
    const y = d3.scale.linear().range([this.size.height, 0])

    y.domain([0, 1])

    const color = d3.scale.category20()

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left').tickFormat(formatPercent)

    const nest = d3.nest().key(d => d.series)
    const entries = nest.entries(data)
    entries.forEach(e => {
      e.values.forEach(v => {
        v.date = parseDate(v.category)
      })
    })

    x.domain(d3.extent(data, d => d.date))
    color.domain(entries.map(e => e.key))

    const line = d3.svg.line()
    .x(d => x(d.date))
    .y(d => y(d.value / 100))

    // Add a line for every series
    svg.selectAll('path')
    .data(entries)
    .enter().append('path')
    .attr('class', 'series')
    .attr('d', d => line(d.values))
    .attr('stroke', d => color(d.key))
    .attr('fill', 'none')

    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + this.size.height + ')')
    .call(xAxis)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints}/>
    )
  }

}
