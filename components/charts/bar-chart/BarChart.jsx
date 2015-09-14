import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BarChart extends React.Component {
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
    const isPercent = data.unit === 'percent'

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
    .attr('x', d => {
      return x1(d.title)
    })
    .attr('y', d => {
      const val = parseFloat(d.values[0].tabellvariabel)
      return yScale(val)
    })
    .attr('height', d => {
      const val = parseFloat(d.values[0].tabellvariabel)
      return this.size.height - yScale(val)
    })
    .style('fill', d => seriesColor(d.title))

    const leg = this.legend()
    .color(seriesColor)
    .attr('width', () => 15)
    .attr('height', () => 15)

    const trueBottom = this.size.height + this.margins.bottom
    series.push('typically complicated and long data variable description', 'even more', 'stuff', 'that might', 'show up')
    svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', d => 'translate(' + 0 + ', ' + (trueBottom - leg.attr('height') * 2) + ')')
    .datum(series)
    .call(leg)
  }

  render() {
    const margins = {left: 60, top: 0, right: 40, bottom: 80}
    return (
      <D3Chart data={this.props.data} dimensions={this.props.dimensions} unit={this.props.unit} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}
