import React, {Component, PropTypes} from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class StackedBarChart extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  // Called in context of _d3Chart
  drawPoints(el, data) {

    if (!data) {
      return
    }

    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg

    // Get the unique categories from the data
    const isPercent = data.unit === 'prosent'
    const yAxisLabelFormat = isPercent ? d3.format('%') : d3.format('d')

    // X axis scale for categories
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], 0.1)
    const y = d3.scale.linear().rangeRound([this.size.height, 0])

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    let maxVal = 0
    const seriesNames = []
    preparedData.forEach(item => {
      let y0 = 0
      item.values.forEach(value => {
        if (seriesNames.indexOf(value.title) == -1) {
          seriesNames.push(value.title)
        }
        const val = value.values[0].value
        value.y = val
        value.y0 = y0
        value.y1 = value.y + value.y0
        if (value.y1 > maxVal) {
          maxVal = value.y1
        }
        y0 += val
      })
    })

    const colors = this.colors.domain(seriesNames)

    yAxis.tickFormat(yAxisLabelFormat)
    if (isPercent) {
      y.domain([0, 1])
    } else {
      y.domain([0, maxVal])
    }

    x.domain(preparedData.map(item => item.title))

    const category = svg.selectAll('.category')
    .data(preparedData)
    .enter().append('g')
    .attr('class', 'category')
    .attr('transform', cat => 'translate(' + x(cat.title) + ',0)')

    category.selectAll('rect')
    .data(cat => cat.values)
    .enter().append('rect')
    .attr('width', x.rangeBand())
    .attr('y', dataItem => y(dataItem.y1))
    .attr('height', dataItem => y(dataItem.y0) - y(dataItem.y1))
    .style('fill', dataItem => colors(dataItem.title))
    .append('title')
    .text(dataItem => dataItem.title + ': ' + yAxisLabelFormat(dataItem.y))


    // Legend

    const leg = this.legend()
    .color(colors)
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
    .datum(seriesNames)
    .call(leg)

    // Add Y axis
    this.svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    // Add X axis
    this.svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('text')
    .call(this.wrapTextNode, x.rangeBand())
  }

  render() {
    const margin = {left: 40, top: 10, right: 40, bottom: 80}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margin} />
    )
  }
}
