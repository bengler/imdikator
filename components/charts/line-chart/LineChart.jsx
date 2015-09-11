import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

export default class LineChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

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
    let yAxisFormat = d3.format('s')
    if (isPercent) {
      yAxisFormat = d3.format('%')
      y.domain([0, 1])
    } else {
      y.domain([0, data.data.maxValue])
    }
    yAxis.tickFormat(yAxisFormat)

    const dates = []
    data.data.forEach(item => {
      item.values.forEach(val => {
        val.date = parseDate(val.key)
        dates.push(val.date)
      })
    })
    x.domain(d3.extent(dates))

    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + this.size.height + ')')
    .call(xAxis)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const line = d3.svg.line()
    .x(dataItem => x(dataItem.date))
    .y(dataItem => {
      let val = dataItem.values
      if (isPercent) {
        val /= 100
      }
      return y(val)
    })

    const ss = this.svg.selectAll('g.line-serie')
    .data(data.data)
    .enter()
    .append('g')
    .attr('id', dataItem => dataItem.key)
    .attr('class', 'line-serie')

    ss.selectAll('path')
    .data(dataItem => [dataItem])
    .enter()
    .append('path')
    .attr('d', dataItem => line(dataItem.values))
    .attr('fill', 'none')
    .attr('stroke', dataItem => color(dataItem.key))

  }

  render() {
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints}/>
    )
  }

}
