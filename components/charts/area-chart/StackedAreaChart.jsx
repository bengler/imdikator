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

/**
 * Only for development
 */
export default class StackedAreaChart extends React.Component {
  drawPoints(el, data) {
    const svg = this.svg

    const parseDate = d3.time.format('%Y').parse
    const formatPercent = d3.format('%')

    const x = d3.time.scale().range([0, this.size.width])
    const y = d3.scale.linear().range([this.size.height, 0])

    const color = d3.scale.category20()

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left').tickFormat(formatPercent)

    const area = d3.svg.area()
    .x(d => x(d.date))
    .y0(d => y(d.y0))
    .y1(d => y(d.y0 + d.y))

    data.forEach(d => d.date = parseDate(d.category))

    const stack = d3.layout.stack().values(d => d.values)

    const nest = d3.nest().key(d => d.series).key(d => d.category)

    let maxY = 0
    const entries = nest.entries(data)
    const numSeries = entries.length
    const r = entries.map(s => {
      return {
        name: s.key,
        values: s.values.map(v => {
          const val = v.values[0].value / 100
          if (maxY < val) {
            maxY = val
          }
          return {
            date: v.values[0].date,
            y: val
          }
        })
      }
    })

    y.domain([0, maxY * numSeries])
    const series = stack(r)

    x.domain(d3.extent(data, d => d.date))

    svg.selectAll('.area')
    .data(series)
    .enter()
    .append('g')
    .append('path')
    .attr('class', 'area')
    .attr('d', d => area(d.values))
    .style('fill', d => color(d.name))
    .style('stroke', '#abc')

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
