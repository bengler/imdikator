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
    if (dimensionLabels.length == 1) {
      // Add a needed second dimension
      dimensionLabels.push('enhet')
    }
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg

    const categories = preparedData.map(entry => entry.title)

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    const xScales = {}
    preparedData.forEach(cat => {
      const catSeries = cat.values.map(val => val.title)
      const x = d3.scale.ordinal().domain(catSeries).rangeRoundBands([0, x0.rangeBand()], 0.05)
      xScales[cat.key] = x
    })

    // Get the unique categories from the data
    const series = []
    preparedData.forEach(item => {
      item.values.forEach(val => {
        val.scale = xScales[item.key]
        if (series.indexOf(val.title) == -1) {
          series.push(val.title)
        }
      })
    })

    // A range of 20 colors
    const seriesColor = this.colors.domain(series)

    // Y config
    const extent = d3.extent(data.rows, item => item.value)
    const yc = this.configureYscale(extent, data.unit)

    const yAxis = d3.svg.axis().scale(yc.scale).orient('left')
    yAxis.tickFormat(yc.format)

    const category = svg.selectAll('.category')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('class', 'category')
    .attr('transform', d => 'translate(' + x0(d.title) + ',' + 0 + ')')

    category.selectAll('rect.bar')
    .data(d => d.values)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('width', item => {
      return item.scale.rangeBand()
    })
    .attr('x', dataItem => dataItem.scale(dataItem.title))
    .attr('y', d => {
      const val = d.values[0].value
      if (isNaN(val)) {
        return 0
      }
      return yc.scale(Math.max(0, val))
    })
    .attr('height', d => {
      const val = d.values[0].value
      if (isNaN(val)) {
        return 0
      }
      return Math.abs(yc.scale(0) - yc.scale(val))
    })
    .style('fill', dataItem => seriesColor(dataItem.title))
    .each(function (item) {
      item.el = this
    })

    window.rune = yc.scale

    category.selectAll('rect.hover')
    .data(d => d.values)
    .enter().append('rect')
    .attr('class', 'hover')
    .attr('width', item => item.scale.rangeBand())
    .attr('x', dataItem => dataItem.scale(dataItem.title))
    // Want full height for this one
    .attr('y', 0)
    .attr('height', () => this.size.height - yc.scale(yc.scale.domain()[1]))
    .attr('pointer-events', 'all')
    .style('fill', 'none')
    .on('mouseover', item => {
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: yc.format(item.values[0].value),
        el: item.el
      })
    })
    .on('mouseout', () => {
      this.eventDispatcher.emit('datapoint:hover-out')
    })

    const leg = this.legend()
    .color(seriesColor)

    /*
    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})
    */

    // Add some space between the x axis labels and the legends
    const legendBottom = this.size.height + 30
    svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', () => 'translate(' + 0 + ', ' + (legendBottom) + ')')
    .datum(series)
    .call(leg)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    const xAxisEl = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)

    xAxisEl.select('path').remove()

    xAxisEl
    .selectAll('.tick text')
    .call(this.wrapTextNode, x0.rangeBand())


    // Add zero-line
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + yc.scale(0) + ')')
    .call(xAxis.tickFormat('').tickSize(0))

  }

  render() {
    const margins = {left: 60, top: 10, right: 40, bottom: 80}
    return (
      <div>
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
      </div>
    )
  }
}
