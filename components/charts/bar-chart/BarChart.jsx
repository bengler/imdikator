import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {CHARTS} from '../../../config/chartTypes'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BarChart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: React.PropTypes.object,
    className: React.PropTypes.string
  }
  /* eslint-enable react/forbid-prop-types */

  prepareData(data) {
    const dimensionLabels = data.dimensions
    if (dimensionLabels.length == 1) {
      // Add a needed second dimension
      dimensionLabels.unshift('region')
    }

    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)
    preparedData.extent = d3.extent(data.rows, item => parseFloat(item.value))

    return {
      unit: data.unit,
      preparedData
    }
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const svg = this.svg

    const categories = data.preparedData.map(entry => entry.title)

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    const xScales = {}
    const innerPaddingFactor = 0.2
    const outerPaddingFactor = 0

    const maxWidth = CHARTS.bar.maxBarWidth

    data.preparedData.forEach(cat => {
      const catSeries = cat.values.map(val => val.title)

      const scale = d3.scale.ordinal()
      .domain(catSeries)
      .rangeRoundBands([0, x0.rangeBand()], innerPaddingFactor, outerPaddingFactor)

      this.limitScaleRangeBand(scale, maxWidth)
      xScales[cat.key] = scale
    })

    // Y config
    const yc = this.configureYscale(data.preparedData.extent, data.unit)

    // A range of 20 colors
    let seriesColor = this.textures
    // Clear the domain
    seriesColor.domain([])

    // Get the unique categories from the data
    const series = []
    data.preparedData.forEach(item => {
      item.values.forEach(val => {
        // Expand the color domain if this is a new series
        if (series.indexOf(val.title) == -1) {
          series.push(val.title)
        }
        seriesColor = seriesColor.domain(series)

        // Category specific X scale
        val.scale = xScales[item.key]

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

    this.addYAxis(yc.scale, yc.axisFormat)

    const category = svg.selectAll('.category')
    .data(data.preparedData)
    .enter()
    .append('g')
    .attr('class', 'category')
    .attr('transform', dataItem => this.translation(x0(dataItem.title), 0))

    category.selectAll('rect.bar')
    .data(dataItem => dataItem.values)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', item => item.scale.rangeBand())
    .attr('x', dataItem => dataItem.scale(dataItem.title))
    .attr('y', dataItem => {
      const val = Math.max(0, dataItem.value)
      return yc.scale(val)
    })
    .attr('height', dataItem => Math.abs(yc.scale(0) - yc.scale(dataItem.value)))
    .style('fill', dataItem => dataItem.fill)
    .style('stroke', dataItem => dataItem.stroke)
    .style('stroke-width', dataItem => dataItem.strokeWidth)
    .each(function (item) {
      item.el = this
    })

    let hoveropen = false
    const open = item => {
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: item.formattedValue,
        el: item.el
      })
      hoveropen = true
    }
    const close = () => {
      this.eventDispatcher.emit('datapoint:hover-out')
      hoveropen = false
    }
    category.selectAll('rect.hover')
    .data(dataItem => dataItem.values)
    .enter()
    .append('rect')
    .attr('class', 'hover')
    .attr('width', item => item.scale.rangeBand())
    .attr('x', dataItem => dataItem.scale(dataItem.title))
    // Want full height for this one
    .attr('y', 0)
    .attr('height', () => this.size.height - yc.scale(yc.scale.domain()[1]))
    .attr('pointer-events', 'all')
    .style('fill', 'none')
    .on('touchend', item => {
      if (hoveropen) {
        close()
      } else {
        open(item)
      }
    })
    .on('mouseover', item => open(item))
    .on('mouseout', () => close())

    /* eslint-disable prefer-reflect */
    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    const xAxisEl = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', this.translation(0, this.size.height))
    .call(xAxis)

    // Remove default X axis line (in case we translated up to make room
    // for negative values)
    xAxisEl.select('path').remove()

    const txts = xAxisEl.selectAll('.tick text')
    txts.call(this.wrapTextNode, x0.rangeBand())

    const leg = this.legend().color(seriesColor)
    // Add some space between the x axis labels and the legends
    const legendWrapper = svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .datum(series)
    .call(leg)
    /* eslint-enable prefer-reflect */

    const xAxisHeight = xAxisEl.node().getBBox().height
    const legendBottom = this.size.height + xAxisHeight
    legendWrapper.attr('transform', () => this.translation(0, legendBottom))

    // Expand the height to fit the legend
    this._svg.attr('height', this.fullHeight + xAxisHeight + leg.height())
  }

  render() {
    const functions = {
      drawPoints: this.drawPoints
    }

    const config = {
      shouldCalculateMargins: true
    }

    const data = this.prepareData(this.props.data)

    return (
      <div>
      <D3Chart data={data} config={config} functions={functions} className={this.props.className}/>
      </div>
    )
  }
}
