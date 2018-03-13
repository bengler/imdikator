import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import CHARTS_CONFIG from '../../../config/chartsConfigs'
import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

/**
 * Only for development
 */
export default class StackedAreaChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  };

  prepareData(data) {
    const dimensionLabels = data.dimensions.map(item => item.name)
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, data.dimensions), dimensionLabels)

    // Preapre properties for the area() function
    preparedData.forEach(series => {
      series.total = 0
      series.values.forEach(val => {
        val.series = series.title
        val.y = val.values[0].value
        series.total += val.y
      })
    })

    // Stack our data
    const stack = d3.layout.stack()
    stack.values(dataItem => dataItem.values)
    const series = stack(preparedData)
    let maxStackedValue = 0
    // Scale the y axis based on the maximum stacked value
    series.forEach(cat => {
      cat.values.forEach(item => {
        const sum = item.y0 + item.y
        if (sum > maxStackedValue) {
          maxStackedValue = sum
        }
      })
    })
    preparedData.extent = [0, maxStackedValue]

    return {
      unit: data.unit,
      preparedData,
      series
    }
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const svg = this.svg

    const parseDate = d3.time.format('%Y').parse

    const x = d3.time.scale().range([0, this.size.width])
    const yc = this.configureYscale(data.preparedData.extent, data.unit)
    const y = yc.scale

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .innerTickSize(10)

    const yAxis = d3.svg.axis().scale(y).orient('left')

    yAxis.tickFormat(yc.axisFormat)

    const area = d3.svg.area()
      .x(dataItem => x(dataItem.date))
      .y0(dataItem => y(dataItem.y0))
      .y1(dataItem => y(dataItem.y0 + dataItem.y))

    const dates = []
    data.preparedData.forEach(item => {
      item.values.forEach(value => {
        value.date = parseDate(value.key)
        dates.push(value.date)
      })
    })

    // Make sure we dont drop down to displaying months by
    // having more ticks on the scale than we have unique dates
    const defaultNumberOfTicks = xAxis.ticks()
    const numberOfDates = d3.set(dates).size()
    if (numberOfDates < defaultNumberOfTicks) {
      xAxis.ticks(numberOfDates)
    }
    if (xAxis.ticks()[0] > (this.size.width / 50)) {
      xAxis.ticks(this.size.width / 50)
    }

    // Scale the X axis by the date range in the data
    x.domain(d3.extent(dates))

    const color = this.textures.domain(data.series.map(serie => serie.title))
    this.addYAxis(yc.scale, yc.axisFormat)

    const focus = svg.append('g')
    .attr('transform', 'translate(-100,-100)')
    .attr('class', 'chart__line-dot-focus')
    focus.append('circle')
    .attr('r', 3.5)

    let hoveropen = false
    const open = item => {
      const xPos = x(item.date)
      const yPos = y(item.y + item.y0)
      focus.attr('transform', this.translation(xPos, yPos))

      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.series,
        body: `${item.title}: ${yc.format(item.y)}`,
        el: focus.node()
      })
      hoveropen = true
    }
    const close = () => {
      this.eventDispatcher.emit('datapoint:hover-out')
      hoveropen = false
    }

    // Add hover dots for screen readers
    const sc = this.svg.selectAll('g.chart__line-dot')
    .data(data.series)
    .enter()
    .append('g')
    .attr('class', 'chart__line-dot')

    sc.selectAll('circle')
    .data(dataItem => dataItem.values.filter(item => !item.anonymized))
    .enter()
    //.append('svg:a')
    //.attr('xlink:href', 'javascript://') // eslint-disable-line no-script-url
    //.attr('aria-label', item => 'År: ' + item.title + ', Verdi: ' + item.y) // For screenreaders
    //.on('click', () => d3.event.stopPropagation())
    //.on('focus', item => open(item))
    .append('circle')
    .attr('cx', dataItem => x(dataItem.date))
    .attr('cy', dataItem => y(dataItem.y + dataItem.y0))
    .attr('r', dataItem => 1)
    .style('fill', 'none')

    svg.selectAll('.chart__area')
    .data(data.series)
    .enter()
    .append('g')
    .append('path')
    .attr('class', 'chart__area')
    .attr('d', dataItem => area(dataItem.values))
    .style('fill', dataItem => color(dataItem.title))
    .style('stroke', 'none')

    // legend
    const leg = this.legend().color(color)

    /*
    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})
    */

    // Voronoi Tesselation hover points

    // Add a voronoi tesselation for mouseover
    const voronoi = d3.geom.voronoi()
    .x(dataItem => x(dataItem.date))
    .y(dataItem => {
      return y(dataItem.y + dataItem.y0)
    })
    .clipExtent([[0, 0], [this.size.width, this.size.height]])

    const voronoiGroup = svg.append('g')
    .attr('class', 'chart__voronoi')

    // Filter out any undefined points on the lines
    const voronoiPoints = data.series.map(item => {
      const vals = item.values.filter(val => !isNaN(val.y))
      item.values = vals
      return item
    })

    const nest = d3.nest().key(item => {
      return `${x(item.date)},${y(item.y + item.y0)}`
    })
    .rollup(value => value[0])
    const voronoiData = nest.entries(d3.merge(voronoiPoints.map(item => item.values)))
    .map(item => item.values)

    voronoiGroup.selectAll('path')
    .data(voronoi(voronoiData))
    .enter()
    .append('path')
    .attr('d', item => `M${item.join('L')}Z`)
    .datum(dataItem => dataItem.point)
    .style('fill', 'none')
    .style('stroke', 'none')
    .style('pointer-events', 'all')
    .on('touchend', item => {
      if (hoveropen) {
        close()
      } else {
        open(item)
      }
    })
    .on('mouseover', item => open(item))
    .on('mouseout', () => close())

    // Add the X axis
    /* eslint-disable prefer-reflect */
    const xAxisEl = svg.append('g')
    .attr('class', 'chart__axis')
    .attr('transform', this.translation(0, this.size.height))
    .call(xAxis)
    /* eslint-enable prefer-reflect */

    // Remove default X axis line
    xAxisEl.select('path').remove()

    // Add some space between the x axis labels and the legends
    const xAxisMargin = xAxisEl.node().getBBox().height + 42
    const legendBottom = this.fullHeight + xAxisMargin
    /* eslint-disable prefer-reflect */
    this._svg.append('g')
    .attr('class', 'chart__legend-wrapper')
    .attr('width', this.fullWidth)
    // Place it at the very bottom
    .attr('transform', () => this.translation(0, legendBottom))
    .datum(data.series.map(serie => serie.title))
    .call(leg)
    /* eslint-enable prefer-reflect */

    // Expand the height to fit the legend
    const expandedHeight = this.fullHeight + xAxisMargin + leg.height()
    this._svg
    .attr('height', expandedHeight)
    .attr('viewBox', `0 0 ${this.fullWidth} ${expandedHeight}`)

  }

  render() {
    const functions = {
      drawPoints: this.drawPoints,
      calculateMargins: this.calculateMargins
    }
    const data = this.prepareData(this.props.data)
    const config = {
      shouldCalculateMargins: true,
    }

    if (CHARTS_CONFIG.stackedArea.minWidthPerCategory) {
      const numCategories = data.preparedData.length
      config.minimumWidth = numCategories * CHARTS_CONFIG.stackedArea.minWidthPerCategory
    }

    return (
      <D3Chart data={data} functions={functions} config={config} />
    )
  }
}
