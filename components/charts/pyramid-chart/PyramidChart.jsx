import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import CHARTS_CONFIG from '../../../config/chartsConfigs'
import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class PyramidChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  };

  calculateMargins() {
    return {}
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    // Config
    const middleMargin = 30
    const svg = this.svg

    // Prepare data
    const preparedData = data.preparedData

    // We only care about the format here
    const format = this.configureYscale([0, 0], data.unit).format

    const color = this.textures
    const groups = []
    const series = []
    preparedData.forEach(item => {
      item.values.forEach(val => {
        const seriesName = val.title
        if (series.indexOf(seriesName) == -1) {
          series.push(seriesName)
        }
        color.domain(series)
        val.values.forEach(group => {
          if (group.values[0].anonymized) {
            group.stroke = color(seriesName)
            group.strokeWidth = 1
            group.fill = 'none'
          } else if (group.values[0].missingData) {
            group.stroke = 'none'
            group.strokeWidth = 0
            group.fill = 'none'
          } else {
            group.stroke = 'none'
            group.strokeWidth = 0
            group.fill = color(val.title)
          }
          group.value = group.values[0].value
          group.formattedValue = group.values[0].formattedValue
          if (!group.formattedValue) {
            group.formattedValue = format(group.values[0].value)
          }
          if (groups.indexOf(group.key) == -1) {
            groups.push(group.title)
          }
        })
      })
    })

    const regions = preparedData.map(item => item.title)
    const outerXScale = d3.scale.ordinal().rangeRoundBands([0, this.size.width], 0.05, 0).domain(regions)

    const regionWidth = outerXScale.rangeBand() / 2 - middleMargin
    const pointA = regionWidth
    const pointB = outerXScale.rangeBand() - regionWidth

    const xScale = d3.scale.linear()
    .domain([0, preparedData.maxValue])
    .range([0, regionWidth])

    const yScale = d3.scale.ordinal()
    .domain(groups)
    .rangeRoundBands([this.size.height, 0], 0.1)

    const yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4, 0)
    .tickPadding(middleMargin - 4)

    const yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4, 0)
    .tickFormat('')

    const xAxisRight = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(format)
    .ticks(1)
    .innerTickSize(10)

    const xAxisLeft = d3.svg.axis()
    .scale(xScale.copy().range([pointA, 0]))
    .orient('bottom')
    .tickFormat(format)
    .ticks(1)
    .innerTickSize(10)

    // The axis
    const outerXAxis = d3.svg.axis().scale(outerXScale)
    .innerTickSize(10)

    const outerXAxisMargin = 20
    /* eslint-disable prefer-reflect */
    const outerXAxisEl = svg.append('g')
    .attr('class', 'chart__axis')
    .call(outerXAxis)
    .attr('transform', this.translation(0, this.size.height + outerXAxisMargin))

    const txts = outerXAxisEl.selectAll('.tick text')
    txts.call(this.wrapTextNode, outerXScale.rangeBand())
    /* eslint-enable prefer-reflect */

    let xAxisLabelHeight = 0
    txts.each(function (item) {
      const height = this.getBBox().height
      if (height > xAxisLabelHeight) {
        xAxisLabelHeight = height
      }
    })

    outerXAxisEl
    .select('path')
    .attr('display', 'none')

    outerXAxisEl
    .selectAll('line')
    .remove()

    const category = svg.selectAll('.chart__category')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('class', 'chart__category')
    .attr('transform', (item, i) => this.translation(outerXScale(item.title), 0))

    // The bars
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

    // Left side
    const leftBarGroup = category.append('g')
    .attr('transform', `${this.translation(pointA, 0)}scale(-1,1)`)

    leftBarGroup.selectAll('.chart__bar.chart__bar--left')
      .data(item => {
        return item.values[0].values
      })
      .enter()
      .append('rect')
      .each(function (item) {
        item.el = this
      })
      .attr('class', 'chart__bar chart__bar--left')
      .attr('x', 0)
      .attr('y', dataItem => yScale(dataItem.title))
      .attr('width', dataItem => xScale(dataItem.value))
      .attr('height', yScale.rangeBand())
      .attr('fill', dataItem => dataItem.fill)
      .attr('stroke', dataItem => dataItem.stroke)
      .attr('stroke-width', dataItem => dataItem.strokeWidth)

    leftBarGroup.selectAll('rect.chart__bar-hover')
    .data(item => {
      return item.values[0].values
    })
    .enter()
//     .append('svg:a')
//     .attr('xlink:href', 'javascript://') // eslint-disable-line no-script-url
//     .attr('aria-label', item => item.title + ' ' + item.formattedValue) // For screenreaders
//     .on('click', () => d3.event.stopPropagation())
//     .on('focus', item => open(item))
    .append('rect')
    .attr('class', 'chart__bar-hover')
    .attr('width', xScale(xScale.domain()[1]))
    .attr('height', yScale.rangeBand())
    .attr('x', 0)
    .attr('y', dataItem => yScale(dataItem.title))
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

    // Right side
    const rightBarGroup = category.append('g')
    .attr('transform', this.translation(pointB, 0))

    rightBarGroup.selectAll('.chart__bar.chart__bar--right')
    .data(item => {
      return item.values[1].values
    })
    .enter()
    .append('rect')
    .each(function (item) {
      item.el = this
    })
    .attr('class', 'chart__bar chart__bar--right')
    .attr('x', 0)
    .attr('y', dataItem => yScale(dataItem.title))
    .attr('width', dataItem => xScale(dataItem.value))
    .attr('height', yScale.rangeBand())
    .attr('fill', dataItem => dataItem.fill)
    .attr('stroke', dataItem => dataItem.stroke)
    .attr('stroke-width', dataItem => dataItem.strokeWidth)

    rightBarGroup.selectAll('rect.chart__bar-hover')
    .data(item => {
      return item.values[1].values
    })
    .enter()
    .append('svg:a')
    .attr('xlink:href', 'javascript://') // eslint-disable-line no-script-url
    .on('click', () => d3.event.stopPropagation())
    .on('focus', item => open(item))
    .append('rect')
    .attr('class', 'chart__bar-hover')
    .attr('width', xScale(xScale.domain()[1]))
    .attr('height', yScale.rangeBand())
    .attr('x', 0)
    .attr('y', dataItem => yScale(dataItem.title))
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

    // The axis
    /* eslint-disable prefer-reflect */
    category
    .append('g')
    .attr('class', 'chart__axis chart__axis--y chart__axis--left')
    .attr('transform', this.translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle')

    category.append('g')
    .attr('class', 'chart__axis chart__axis--y chart__axis--right')
    .attr('transform', this.translation(pointB, 0))
    .call(yAxisRight)

    category.append('g')
    .attr('class', 'chart__axis chart__axis--x chart__axis--left')
    .attr('transform', this.translation(0, this.size.height))
    .call(xAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'start')

    category.append('g')
    .attr('class', 'chart__axis chart__axis--x chart__axis--right')
    .attr('transform', this.translation(pointB, this.size.height))
    .call(xAxisRight)
    .selectAll('text')
    .style('text-anchor', 'end')

    // Legend
    const leg = this.legend().color(color)

    /*
    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})
    */

    // Add some space between the x axis labels and the legends
    const xAxisMargin = 20
    const legendBottom = this.size.height + outerXAxisMargin + xAxisLabelHeight + xAxisMargin
    svg.append('g')
    .attr('class', 'chart__legend-wrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', () => this.translation(0, legendBottom))
    .datum(series)
    .call(leg)

    // Expand the height to fit the legend
    /* eslint-enable prefer-reflect */
    const expandedHeight = this.fullHeight + outerXAxisMargin + xAxisLabelHeight + xAxisMargin + leg.height()
    this._svg
    .attr('height', expandedHeight)
    .attr('viewBox', `0 0 ${this.fullWidth} ${expandedHeight}`)

  }

  prepareData(data) {
    const dimensionLabels = data.dimensions.map(item => item.name)
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, data.dimensions), dimensionLabels)

    return {
      unit: data.unit,
      preparedData
    }
  }

  render() {
    const functions = {
      drawPoints: this.drawPoints,
    }
    const data = this.prepareData(this.props.data)
    const config = {}
    if (CHARTS_CONFIG.pyramid.minWidthPerCategory) {
      const numCategories = data.preparedData.length
      config.minimumWidth = numCategories * CHARTS_CONFIG.pyramid.minWidthPerCategory
    }
    return (
      <D3Chart data={data} config={config} functions={functions} />
    )
  }
}
