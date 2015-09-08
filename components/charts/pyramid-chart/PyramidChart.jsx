import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

export default class PyramidChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data || !data.hasOwnProperty('data') || !data.hasOwnProperty('unit')) {
      return
    }

    const svg = this.svg

    const nesting = d3.nest().key(entry => entry.category).key(entry => entry.series).key(entry => entry.dimention)
    const entries = nesting.entries(data.data)
    const categories = entries.map(entry => entry.key)

    const dimentions = d3.nest().key(entry => entry.dimention).entries(data.data).map(entry => entry.key)

    const seriesNames = d3.nest().key(entry => entry.series).entries(data.data).map(entry => entry.key)

    const color = d3.scale.category20().domain(seriesNames)

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    // X axis scale for series
    const x1 = d3.scale.ordinal()
    x1.domain(seriesNames).rangeRoundBands([0, x0.rangeBand()], 0, 0.1)

    // X axis scale for values in a series
    const x2 = d3.scale.linear()
    const minMax = [0, d3.max(data.data.map(d => d.value))]
    x2.domain(minMax).range([0, x1.rangeBand()])

    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('path, .tick > line')
    .style('display', 'none')
    .selectAll('.tick text')
    .call(this.wrapTextNode, x0.rangeBand())

    // Y axis scale for dimentions
    const y0 = d3.scale.ordinal().domain(dimentions).rangeRoundBands([this.size.height, 0], 0.25, 0.5)

    const category = svg.selectAll('.category')
    .data(entries)
    .enter().append('g')
    .attr('class', dataItem => 'category')
    .attr('transform', d => 'translate(' + x0(d.key) + ',0)')

    const series = category.selectAll('.series')
    .data(d => d.values)
    .enter().append('g')
    .attr('class', d => {
      if (seriesNames.indexOf(d.key) == 0) {
        return 'series left'
      }
      return 'series right'
    })
    .attr('alt', dataItem => dataItem.key)
    .attr('transform', (dataItem, index) => {
      const xTranslate = x1(dataItem.key)
      return 'translate(' + xTranslate + ',0)'
    })

    // Add axis to all series
    const sx0 = d3.scale.linear()
    sx0.domain(minMax).range([0, x1.rangeBand()])
    const rightSeriesAxis = d3.svg.axis().scale(sx0).orient('bottom')
    rightSeriesAxis.tickValues(minMax)
    svg.selectAll('.series.right')
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + (this.size.height - 20) + ')')
    .call(rightSeriesAxis)

    // Left
    const sx1 = d3.scale.linear()
    sx1.domain(minMax.reverse()).range([0, x1.rangeBand()])
    const leftSeriesAxis = d3.svg.axis().scale(sx1).orient('bottom')
    leftSeriesAxis.tickValues(rightSeriesAxis.tickValues())
    svg.selectAll('.series.left')
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + (this.size.height - 20) + ')')
    .call(leftSeriesAxis)

    series.selectAll('rect')
    .data(d => d.values)
    .enter().append('rect')
    .attr('height', dataItem => y0.rangeBand())
    .attr('width', dataItem => {
      const value = dataItem.values[0].value
      return x2(value)
    })
    .attr('x', (dataItem, index) => {
      const seriesIndex = seriesNames.indexOf(dataItem.values[0].series)
      const value = dataItem.values[0].value
      if (seriesIndex == 0) {
        return x1.rangeBand() - x2(value)
      }
      return x1(dataItem.key)
    })

    .attr('y', d => y0(d.key))
    .style('fill', dataItem => {
      const seriesName = dataItem.values[0].series
      return color(seriesName)
    })

  }

  render() {
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints}/>
    )
  }

}
