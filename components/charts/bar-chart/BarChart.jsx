import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BarChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg
    const isPercent = data.unit === 'prosent'

    // Get the unique categories from the data
    const categories = preparedData.map(entry => entry.title)
    const series = preparedData[0].values.map(val => val.title)

    // A range of 20 colors
    const seriesColor = d3.scale.category20().domain(series)

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    // X axis scale for series
    const x1 = d3.scale.ordinal()
    x1.domain(series).rangeRoundBands([0, x0.rangeBand()], 0.05)

    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('.tick text')
    .call(this.wrapTextNode, x0.rangeBand())

    // Add the Y axsis
    const yScale = d3.scale.linear().range([this.size.height, 0])
    const yAxis = d3.svg.axis().scale(yScale).orient('left')

    // Percentage scale it (divide the values by 100)
    if (isPercent) {
      yAxis.tickFormat(d3.format('%'))
      yScale.domain([0, 1])
    } else {
      yScale.domain([0, preparedData.maxValue])
    }

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const category = svg.selectAll('.category')
    .data(preparedData)
    .enter().append('g')
    .attr('class', 'category')
    .attr('transform', d => 'translate(' + x0(d.title) + ',0)')

    category.selectAll('rect')
    .data(d => d.values)
    .enter().append('rect')
    .attr('width', x1.rangeBand())
    .attr('x', dataItem => x1(dataItem.title))
    .attr('y', d => {
      const val = d.values[0].value
      return yScale(val)
    })
    .attr('height', d => {
      const val = d.values[0].value
      return this.size.height - yScale(val)
    })
    .style('fill', dataItem => seriesColor(dataItem.title))

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
    const margins = {left: 60, top: 10, right: 40, bottom: 80}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}
