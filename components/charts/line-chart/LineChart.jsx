import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

export default class LineChart extends React.Component {
  drawPoints(el, data) {
    if (!data || !data.hasOwnProperty('data') || !data.hasOwnProperty('unit')) {
      return
    }

    const svg = this.svg
    const parseDate = d3.time.format('%Y').parse

    const x = d3.time.scale().range([0, this.size.width])
    const y = d3.scale.linear().range([this.size.height, 0])

    const color = d3.scale.category20()

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    const isPercent = data.unit === 'percent'
    let yAxisFormat = d3.format('d')
    if (isPercent) {
      yAxisFormat = d3.format('%')
      y.domain([0, 1])
    } else {
      y.domain([0, d3.max(data.data, dataItem => dataItem.value)])
    }

    yAxis.tickFormat(yAxisFormat)

    const nest = d3.nest().key(dataItem => dataItem.series)
    const entries = nest.entries(data.data)
    entries.forEach(entry => {
      entry.values.forEach(value => {
        value.date = parseDate(String(value.category))
      })
    })

    x.domain(d3.extent(data.data, dataItem => dataItem.date))
    color.domain(entries.map(entry => entry.key))

    const line = d3.svg.line()
    .x(dataItem => x(dataItem.date))
    .y(dataItem => {
      let val = dataItem.value
      if (isPercent) {
        val /= 100
      }
      return y(val)
    })

    // Add a line for every series
    svg.selectAll('path')
    .data(entries)
    .enter().append('path')
    .attr('class', 'series')
    .attr('d', dataItem => line(dataItem.values))
    .attr('stroke', dataItem => color(dataItem.key))
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
      <D3Chart data={this.props.data} drawPoints={this.drawPoints}/>
    )
  }

}
