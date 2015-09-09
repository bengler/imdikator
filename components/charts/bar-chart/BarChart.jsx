import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

// A range of 20 colors
const seriesColor = d3.scale.category20()

export default class BarChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
  }

  drawPoints(el, data) {

    if (!data || !data.hasOwnProperty('data') || !data.hasOwnProperty('unit')) {
      return
    }

    const svg = this.svg
    const isPercent = data.unit === 'percent'

    // Get the unique categories from the data
    const categories = data.data.map(entry => entry.key)
    const series = data.data[0].values.map(val => val.key)

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
      yScale.domain([0, data.data.maxValue])
    }

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const category = svg.selectAll('.category')
    .data(data.data)
    .enter().append('g')
    .attr('class', 'category')
    .attr('transform', d => 'translate(' + x0(d.key) + ',0)')

    category.selectAll('rect')
    .data(d => d.values)
    .enter().append('rect')
    .attr('width', x1.rangeBand())
    .attr('x', d => x1(d.key))
    .attr('y', d => {
      return yScale(d.values)
    })
    .attr('height', d => this.size.height - yScale(d.values))
    .style('fill', d => seriesColor(d.key))

    // Legend
    const labelScale = d3.scale.ordinal().domain(series).rangeRoundBands([0, this.size.width], 0.1)

    const legend = svg.selectAll('.legend')
    .data(series.slice())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', d => 'translate(' + labelScale(d) + ', ' + -(this.margins.top / 2) + ')')

    legend.append('rect')
    .attr('x', '0')
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', seriesColor)

    legend.append('text')
    .attr('x', '15')
    .attr('y', 10)
    .text(dataItem => dataItem)
    .selectAll('text')
      .call(this.wrapTextNode, labelScale.rangeBand())
  }

  render() {
    const margins = {left: 60, top: 40, right: 40, bottom: 40}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}
