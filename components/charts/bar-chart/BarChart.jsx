import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BarChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    className: React.PropTypes.string
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

    // Y config
    const extent = d3.extent(data.rows, item => parseFloat(item.value))
    const yc = this.configureYscale(extent, data.unit)

    // A range of 20 colors
    let seriesColor = this.colors.domain([])

    // Get the unique categories from the data
    const series = []
    preparedData.forEach(item => {
      item.values.forEach(val => {
        // Expand the color domain if this is a new series
        if (series.indexOf(val.title) == -1) {
          series.push(val.title)
        }
        seriesColor = this.colors.domain(series)

        // Category specific X scale
        val.scale = xScales[item.key]

        // Different handling of anonymized data
        if (val.values[0].anonymized) {
          val.value = 4
          val.fill = 'none'
          val.stroke = seriesColor(val.title)
          val.strokeWidth = 2
          // The nester has put '1-4' as the value
          val.formattedValue = val.values[0].value
        } else if (val.values[0].missingData) {
          val.value = 0
          val.fill = 'none'
          val.stroke = 'none'
          val.strokeWidth = 2
          // The nester has put 'Mangler data' as the value
          val.formattedValue = val.values[0].value
        } else {
          val.value = val.values[0].value
          val.fill = seriesColor(val.title)
          val.stroke = 'none'
          val.strokeWidth = 0
          val.formattedValue = yc.format(val.values[0].value)
        }
      })
    })

    const yAxis = d3.svg.axis().scale(yc.scale).orient('left')
    yAxis.tickFormat(yc.axisFormat)

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
    .attr('width', item => item.scale.rangeBand())
    .attr('x', dataItem => dataItem.scale(dataItem.title))
    .attr('y', d => {
      const val = Math.max(0, d.value)
      return yc.scale(val)
    })
    .attr('height', d => Math.abs(yc.scale(0) - yc.scale(d.value)))
    .style('fill', dataItem => dataItem.fill)
    .style('stroke', dataItem => dataItem.stroke)
    .style('stroke-width', dataItem => dataItem.strokeWidth)
    .each(function (item) {
      item.el = this
    })

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
        body: item.formattedValue,
        el: item.el
      })
    })
    .on('mouseout', () => {
      this.eventDispatcher.emit('datapoint:hover-out')
    })

    const leg = this.legend().color(seriesColor)

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

    // Remove default X axis line (in case we translated up to make room
    // for negative values)
    xAxisEl.select('path').remove()

    xAxisEl
    .selectAll('.tick text')
    .call(this.wrapTextNode, x0.rangeBand())

    // Add a new zero-line, possibly translated up
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + yc.scale(0) + ')')
    .call(xAxis.tickFormat('').tickSize(0))
  }

  render() {
    const margins = {left: 50, top: 10, right: 40, bottom: 80}
    return (
      <div>
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins} className={this.props.className}/>
      </div>
    )
  }
}
