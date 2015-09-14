import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class LineChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    dimensions: React.PropTypes.array,
    unit: React.PropTypes.string
  }
  drawPoints(el, data, dimensions, unit) {
    if (!data) {
      return
    }

    const dimensionLabels = dimensions.map(dim => dim.label)
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data, dimensionLabels), dimensionLabels)

    const svg = this.svg
    const parseDate = d3.time.format('%Y').parse

    const x = d3.time.scale().range([0, this.size.width])
    const y = d3.scale.linear().range([this.size.height, 0])

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    const isPercent = unit === 'percent'
    let yAxisFormat = d3.format('s')
    if (isPercent) {
      yAxisFormat = d3.format('%')
      y.domain([0, 1])
    } else {
      y.domain([0, preparedData.maxValue])
    }
    yAxis.tickFormat(yAxisFormat)

    const dates = []
    preparedData.forEach(item => {
      item.values.forEach(value => {
        value.date = parseDate(value.key)
        dates.push(value.date)
        value.value = parseFloat(value.values[0].tabellvariabel)
        if (isPercent) {
          value.value /= 100
        }
      })
    })

    const series = preparedData.map(item => item.title)
    const seriesColor = d3.scale.category20().domain(series)

    x.domain(d3.extent(dates))

    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + this.size.height + ')')
    .call(xAxis)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const line = d3.svg.line()
    .x(dataItem => {
      return x(dataItem.date)
    })
    .y(dataItem => y(dataItem.value))

    const ss = this.svg.selectAll('g.line-serie')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('id', dataItem => dataItem.key)
    .attr('class', 'line-serie')

    ss.selectAll('path')
    .data(dataItem => [dataItem])
    .enter()
    .append('path')
    .attr('d', dataItem => {
      return line(dataItem.values)
    })
    .attr('fill', 'none')
    .attr('stroke', dataItem => seriesColor(dataItem.title))

    const leg = this.legend()
    .color(seriesColor)
    .attr('width', () => 15)
    .attr('height', () => 15)

    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})

    // Add some space between the x axis labels and the legends
    const legendBottom = this.size.height + 30
    svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', () => 'translate(' + 0 + ', ' + (legendBottom) + ')')
    .datum(series)
    .call(leg)
  }

  render() {
    const margins = {left: 40, top: 20, right: 40, bottom: 70}
    return (
      <D3Chart margins={margins} dimensions={this.props.dimensions} unit={this.props.unit} data={this.props.data} drawPoints={this.drawPoints}/>
    )
  }

}
