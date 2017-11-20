import React, {Component, PropTypes} from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'
import CHARTS_CONFIG from '../../../config/chartsConfigs'

export default class StackedBarChart extends Component {
  static propTypes = {
    data: PropTypes.object,
    explicitView: React.PropTypes.bool,
  };

  prepareData(data) {
    const dimensionLabels = data.dimensions.map(item => item.name)
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, data.dimensions), dimensionLabels)

    const values = []
    preparedData.forEach(item => {
      let y0 = 0
      item.values.forEach(value => {
        const val = value.values[0].value
        value.y = val
        value.y0 = y0
        value.y1 = value.y + value.y0
        values.push(value.y1)
        y0 += val
      })
    })
    preparedData.extent = d3.extent(values)
    return {
      unit: data.unit,
      preparedData,
    }
  }

  // Called in context of _d3Chart
  drawPoints(el, data) {
    if (!data) {
      return
    }

    const svg = this.svg

    const seriesNames = d3.set()
    data.preparedData.forEach(item => {
      item.values.forEach(value => {
        value.category = item.title
        seriesNames.add(value.title)
      })
    })

    // Y config
    const extent = [0, data.preparedData.extent[1]]
    const yc = this.configureYscale(extent, data.unit)
    const y = yc.scale
    this.addYAxis(y, yc.axisFormat)

    const colors = this.textures

    // X axis scale for categories
    // X axis scale for categories
    const x0 = d3.scale.ordinal()
    .domain(data.preparedData.map(item => item.title))
    .rangeRoundBands([0, this.size.width], 0.1)

    const xAxis = d3.svg.axis()
      .scale(x0)
      .orient('bottom')
      .innerTickSize(10)

    const xScales = {}
    const innerPaddingFactor = 0.2
    const outerPaddingFactor = 0

    const maxWidth = CHARTS_CONFIG.stackedBar.maxBarWidth
    data.preparedData.forEach(cat => {

      const scale = d3.scale.ordinal()
      .domain(['stack'])
      .rangeRoundBands([0, x0.rangeBand()], innerPaddingFactor, outerPaddingFactor)

      this.limitScaleRangeBand(scale, maxWidth)
      xScales[cat.title] = scale
    })

    const category = svg.selectAll('.chart__category')
      .data(data.preparedData)
      .enter()
      .append('g')
      .attr('class', 'chart__category')
      .attr('transform', cat => this.translation(x0(cat.title), 0))

    let hoveropen = false
    const open = item => {
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: item.values[0].formattedValue || yc.format(item.values[0].value),
        el: item.el
      })
      hoveropen = true
    }
    const close = () => {
      this.eventDispatcher.emit('datapoint:hover-out')
      hoveropen = false
    }

    //==============================================================
    //  if user has toggled button for showing numbers above graphs
    //==============================================================
    if (this.props.explicitView) {

      const moveNumberToTheRight = 85
      const moveNumberDown = 25
      const hideSmallNumbers = 25

      // Add text indicators
      category.selectAll('rect.chart__text')
      .data(item => item.values)
      .enter()
      .append('text')
      .attr('class', 'chart__text')
      .attr('height', dataItem => y(dataItem.y0) - y(dataItem.y1))
      .attr('width', item => xScales[item.category].rangeBand())
      .attr('x', dataItem => xScales[dataItem.category]('stack') + moveNumberToTheRight)
      .attr('y', dataItem => y(dataItem.y1) + moveNumberDown)
      .each(function (item) {
        item.el = this
      })
      .text(dataItem => {
        if (y(dataItem.y0) - y(dataItem.y1) < hideSmallNumbers) return ''
        return dataItem.values[0].formattedValue || yc.format(dataItem.values[0].value)
      })
    }

    //===================================
    //  hovered chart bars shows numbers
    //===================================
    category.selectAll('rect.chart__bar-hover')
    .data(cat => cat.values)
    .enter()
  //     .append('svg:a')
  //     .attr('xlink:href', 'javascript://') // eslint-disable-line no-script-url
  //     .attr('aria-label', item => item.title + ' ' + item.formattedValue) // For screenreaders
  //     .on('click', () => d3.event.stopPropagation())
  //     .on('focus', item => open(item))
    .append('rect')
    .attr('width', item => xScales[item.category].rangeBand())
    .attr('x', item => xScales[item.category]('stack'))
    .attr('y', dataItem => y(dataItem.y1))
    .attr('height', dataItem => y(dataItem.y0) - y(dataItem.y1))
    .style('fill', dataItem => colors(dataItem.title))
    .each(function (item) {
      item.el = this
    })
    .attr('pointer-events', 'all')
    .on('touchend', item => {
      if (hoveropen) {
        close()
      } else {
        open(item)
      }
    })
    .on('mouseover', item => open(item))
    .on('mouseout', () => close())
    .on('focus', item => open(item))
    .on('blur', () => close())

    // Add X axis
    const xAxisEl = this.svg.append('g')
    .attr('class', 'chart__axis')
    .attr('transform', this.translation(0, this.size.height))
    .call(xAxis)

    xAxisEl.select('path').remove()

    // Wrap the labels on the X axis
    const txts = xAxisEl.selectAll('.tick text')
    txts.call(this.wrapTextNode, x0.rangeBand())

    // Legend
    const leg = this.legend().color(colors)

    const legendWrapper = this._svg.append('g')
    .attr('class', 'chart__legend-wrapper')
    .attr('width', this.fullWidth)
    // Place it at the very bottom
    .datum(seriesNames.values())
    .call(leg)

    // Add some space between the x axis labels and the legends
    const xAxisHeight = xAxisEl.node().getBBox().height + 21
    const legendBottom = this.fullHeight + xAxisHeight
    legendWrapper.attr('transform', () => this.translation(0, legendBottom))

    // Expand the height to fit the legend
    const expandedHeight = this.fullHeight + xAxisHeight + leg.height()
    this._svg
    .attr('height', expandedHeight)
    .attr('viewBox', `0 0 ${this.fullWidth} ${expandedHeight}`)

  }

  render() {
    const functions = {
      drawPoints: this.drawPoints
    }
    const data = this.prepareData(this.props.data)

    const config = {
      shouldCalculateMargins: true
    }

    if (CHARTS_CONFIG.bar.minWidthPerCategory) {
      const numCategories = data.preparedData.length
      config.minimumWidth = numCategories * CHARTS_CONFIG.bar.minWidthPerCategory
    }

    return (
      <D3Chart
        data={data}
        functions={functions}
        config={config}
        explicitView={this.props.explicitView}
      />
    )
  }
}
