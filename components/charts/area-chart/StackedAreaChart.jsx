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

    const x = d3.time.scale().range([0, this.size.width])
    const y = d3.scale.linear().range([this.size.height, 0])

    const color = d3.scale.category20()

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    const area = d3.svg.area()
    .x(dataItem => x(dataItem.date))
    .y0(dataItem => y(dataItem.y0))
    .y1(dataItem => y(dataItem.y0 + dataItem.y))

    const dates = []
    const nest = d3.nest().key(dataItem => dataItem.series).key(dataItem => dataItem.category).rollup(leaves => {
      const leaf = leaves[0]
      leaf.date = parseDate(leaf.category)
      dates.push(leaf.date)
      return leaves
    })

    const preparedData = nest.entries(data)
    // Preapre properties for the area() function
    preparedData.forEach(series => {
      series.values.forEach(val => {
        val.date = val.values[0].date
        val.y = val.values[0].value
      })
    })

    // Scale the X axis by the date range in the data
    x.domain(d3.extent(dates))

    // Scale the Y axis based on the max added value across series in a category
    // FIXME: There must be a better way
    const seriesValues = d3.nest().key(item => item.category).rollup(leaves => leaves.map(node => node.value)).entries(data)
    const allValues = seriesValues.map(item => item.values)
    const summedValues = allValues.map(ary => d3.sum(ary))
    y.domain([0, d3.max(summedValues)])

    const stack = d3.layout.stack().values(dataItem => dataItem.values)
    const series = stack(preparedData)

    svg.selectAll('.area')
    .data(series)
    .enter()
    .append('g')
    .append('path')
    .attr('class', 'area')
    .attr('d', dataItem => area(dataItem.values))
    .style('fill', dataItem => color(dataItem.key))
    .style('stroke', '#abc')

    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + this.size.height + ')')
    .call(xAxis)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const circles = svg.selectAll('.circle')
    .data(preparedData).enter()
    .append('g')

    const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background-color', '#f4f0f0')
    .style('width', '100px')
    .style('height', '50px')

    circles.selectAll('circle').data(d => d.values).enter()
    .append('circle')
    .attr('cx', dataItem => x(dataItem.date))
    .attr('cy', dataItem => y(dataItem.y + dataItem.y0))
    .attr('r', '3')
    .style('fill', 'black')
    .on('mouseover', item => {
      tooltip
      .style('top', d3.event.pageY - 10 + 'px')
      .style('left', d3.event.pageX + 10 + 'px')

      const dataItem = item.values[0]
      tooltip.html('<p>' + dataItem.value + '</p>')
      tooltip.style('visibility', 'visible')
    })
    .on('mouseout', item => tooltip.style('visibility', 'hidden'))
  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints}/>
    )
  }

}
