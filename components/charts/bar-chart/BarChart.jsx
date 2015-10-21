import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

d3.selection.prototype.first = function () {
  return d3.select(this[0][0])
}

d3.selection.prototype.last = function () {
  const last = this.size() - 1
  return d3.select(this[0][last])
}

export default class BarChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    className: React.PropTypes.string
  }

  calculateHeight(data) {
    return 400
  }

  calculateMargins(data) {
    if (!data) {
      return null
    }

    // LEFT MARGIN
    // Need to add a Y axis and see how wide the largest label is
    const extent = d3.extent(data.rows, function (row) { // eslint-disable-line prefer-arrow-callback
      return parseFloat(row.tabellvariabel)
    })
    const yc = this.configureYscale(extent, data.unit, 100)
    const testSVG = d3.select('body').append('svg').style('display', 'hidden')
    const yAxis = d3.svg.axis().scale(yc.scale).orient('left').tickFormat(yc.axisFormat)
    testSVG.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    // Find the longest text string on this axis
    let axislabelLength = 0
    testSVG.selectAll('text').each(function () {
      const len = this.getComputedTextLength()
      if (len > axislabelLength) {
        axislabelLength = len
      }
    })

    testSVG.remove()

    const result = {
      left: axislabelLength + 10 // Add some space for the actual axis and tick marks
    }
    return result
  }

  prepareData(data) {

  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const dimensionLabels = data.dimensions
    if (dimensionLabels.length == 1) {
      // Add a needed second dimension
      dimensionLabels.unshift('region')
    }

    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg

    const categories = preparedData.map(entry => entry.title)

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    const xScales = {}
    const maxSeries = d3.max(preparedData, item => item.values.length)
    const innerPaddingFactor = 0.05
    const outerPaddingFactor = 0
    preparedData.forEach(cat => {
      const catSeries = cat.values.map(val => val.title)
      const seriesLength = catSeries.length
      while (catSeries.length < maxSeries) {
        catSeries.push(Math.random())
      }
      const scale = d3.scale.ordinal().domain(catSeries).rangeRoundBands([0, x0.rangeBand()], innerPaddingFactor, outerPaddingFactor)
      let xOffset = (scale.rangeBand() + (scale.rangeBand() * innerPaddingFactor)) * (maxSeries - seriesLength)
      xOffset /= 2
      xScales[cat.key] = {scale, xOffset}
    })

    // Y config
    const extent = d3.extent(data.rows, item => parseFloat(item.value))
    const yc = this.configureYscale(extent, data.unit)

    // A range of 20 colors
    let seriesColor = this.textures
    // Clear the domain
    seriesColor.domain([])

    // Get the unique categories from the data
    const series = []
    preparedData.forEach(item => {
      item.values.forEach(val => {
        // Expand the color domain if this is a new series
        if (series.indexOf(val.title) == -1) {
          series.push(val.title)
        }
        seriesColor = seriesColor.domain(series)

        // Category specific X scale
        val.scale = xScales[item.key].scale
        val.xOffset = xScales[item.key].xOffset

        // Different handling of anonymized data
        if (val.values[0].anonymized) {
          val.fill = 'none'
          val.stroke = seriesColor(val.title)
          val.strokeWidth = 2
        } else if (val.values[0].missingData) {
          val.fill = 'none'
          val.stroke = 'none'
          val.strokeWidth = 2
        } else {
          val.fill = seriesColor(val.title)
          val.stroke = 'none'
          val.strokeWidth = 0
        }

        val.value = val.values[0].value
        val.formattedValue = val.values[0].formattedValue
        if (!val.formattedValue) {
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
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', item => item.scale.rangeBand())
    .attr('x', dataItem => dataItem.scale(dataItem.title) + dataItem.xOffset)
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
    .enter()
    .append('rect')
    .attr('class', 'hover')
    .attr('width', item => item.scale.rangeBand())
    .attr('x', dataItem => dataItem.scale(dataItem.title) + dataItem.xOffset)
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

    const txts = xAxisEl.selectAll('.tick text')
    txts.call(this.wrapTextNode, x0.rangeBand())

    // Add a new zero-line, possibly translated up
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + yc.scale(0) + ')')
    .call(xAxis.tickFormat('').tickSize(0))

    const leg = this.legend().color(seriesColor)
    // Add some space between the x axis labels and the legends
    const legendWrapper = svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .datum(series)
    .call(leg)

    const xAxisHeight = xAxisEl.node().getBBox().height
    const legendBottom = this.size.height + xAxisHeight
    legendWrapper.attr('transform', () => 'translate(' + 0 + ', ' + (legendBottom) + ')')

    // Expand the height to fit the legend
    this._svg.attr('height', legendBottom + leg.height())
  }

  render() {
    const functions = {
      drawPoints: this.drawPoints,
      calculateHeight: this.calculateHeight,
      calculateMargins: this.calculateMargins
    }
    return (
      <div>
      <D3Chart data={this.props.data} functions={functions} className={this.props.className}/>
      </div>
    )
  }
}
