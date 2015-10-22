import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class LineChart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: React.PropTypes.object
  }
  /* eslint-enable react/forbid-prop-types */

  drawPoints(el, data) {
    if (!data) {
      return
    }

    let dimensionLabels = data.dimensions
    if (dimensionLabels.length > 2) {
      // Need to reduce dimensions
      // The first dimension is allowed in
      dimensionLabels = [data.dimensions[0]]
      // Next and last need to be 'aar'
      const yearDimension = data.dimensions.find(item => item === 'aar')
      if (yearDimension) {
        dimensionLabels.push(yearDimension)
      }
    }

    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg
    const parseDate = d3.time.format('%Y').parse

    const extent = d3.extent(data.rows, item => parseFloat(item.value))
    const yc = this.configureYscale(extent, data.unit)

    const x = d3.time.scale().range([0, this.size.width])
    const y = yc.scale

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')
    yAxis.tickFormat(yc.axisFormat)
    yAxis.scale().nice()

    const isPercent = data.unit === 'prosent'
    const dates = []

    const series = preparedData.map(item => item.title)
    const seriesColor = this.colors.domain(series)

    preparedData.forEach(item => {
      item.color = seriesColor(item.title)
      item.values.forEach(value => {
        value.color = item.color
        value.date = parseDate(value.key)
        value.series = item.title
        dates.push(value.date)
        value.radius = 2
        value.x = value.date
        value.formattedValue = value.values[0].formattedValue
        value.value = value.values[0].value
        if (value.values[0].missingData) {
          value.radius = 0
          value.value = NaN
          value.y = 0
          value.x = 0
        } else if (value.values[0].anonymized) {
          value.value = 4
          value.y = y(isPercent ? value.value / 100 : value.value)
        } else {
          value.y = y(isPercent ? value.value / 100 : value.value)
        }
        if (!value.formattedValue) {
          value.formattedValue = yc.format(isPercent ? value.value / 100 : value.value)
        }
      })
    })

    x.domain(d3.extent(dates))

    // Make sure we dont drop down to displaying months by
    // having more ticks on the scale than we have unique dates
    const defaultNumberOfTicks = xAxis.ticks()
    const numberOfDates = d3.set(dates).size()
    if (numberOfDates < defaultNumberOfTicks) {
      xAxis.ticks(numberOfDates)
    }

    this.addYAxis(yc.scale, yc.axisFormat)

    const line = d3.svg.line()
    .x(dataItem => {
      return x(dataItem.date)
    })
    .y(dataItem => dataItem.y)
    .defined(dataItem => !isNaN(dataItem.value))

    const ss = this.svg.selectAll('g.line-serie')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('id', dataItem => dataItem.key)
    .attr('class', 'line-serie')

    ss.selectAll('path')
    .data(dataItem => [dataItem])
    .enter()
    .append('path')
    .attr('d', dataItem => line(dataItem.values))
    .attr('fill', 'none')
    .attr('stroke', dataItem => dataItem.color)
    .attr('stroke-width', 1)

    const sc = this.svg.selectAll('g.line-dot')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('class', 'line-dot')

    sc.selectAll('circle')
    .data(dataItem => dataItem.values)
    .enter()
    .append('circle')
    .attr('cx', dataItem => x(dataItem.date))
    .attr('cy', dataItem => dataItem.y)
    .attr('r', dataItem => dataItem.radius)
    .style('fill', dataItem => dataItem.color)

    const leg = this.legend().color(seriesColor)

    /*
    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})
    */

    // Add some space between the x axis labels and the legends
    const xAxisMargin = 30
    const legendBottom = this.size.height + xAxisMargin
    /* eslint-disable prefer-reflect */
    svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', () => this.translation(0, legendBottom))
    .datum(series)
    .call(leg)
    /* eslint-enable prefer-reflect */

    // Increase our height to fit the legend
    this._svg.attr('height', this.fullHeight + xAxisMargin + leg.height())

    // Voronoi Tesselation hover points
    const focus = svg.append('g')
    .attr('transform', 'translate(-100,-100)')
    .attr('class', 'focus')
    focus.append('circle')
    .attr('r', 4)

    // Add a voronoi tesselation for mouseover
    const voronoi = d3.geom.voronoi()
    .x(dataItem => x(dataItem.date))
    .y(dataItem => dataItem.y)
    .clipExtent([[0, 0], [this.size.width, this.size.height]])

    const voronoiGroup = svg.append('g')
    .attr('class', 'voronoi')

    // Filter out any undefined points on the lines
    const voronoiPoints = preparedData.map(item => {
      const vals = item.values.filter(val => !isNaN(val.value))
      item.values = vals
      return item
    })

    const nest = d3.nest().key(item => `${x(item.date)},${item.y}`).rollup(value => value[0])
    const voronoiData = nest.entries(d3.merge(voronoiPoints.map(item => item.values)))
    .map(item => item.values)

    voronoiGroup.selectAll('path')
    .data(voronoi(voronoiData))
    .enter().append('path')
    .attr('d', item => `M${item.join('L')}Z`)
    .datum(dataItem => dataItem.point)
    .style('fill', 'none')
    .style('stroke', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', item => {
      focus
      .attr('transform', this.translation(x(item.date), item.y))
      .attr('fill', item.color)
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.series,
        body: item.formattedValue,
        el: focus.node()
      })
    })
    .on('mouseout', item => {
      focus.attr('transform', 'translate(-100,-100)')
      this.eventDispatcher.emit('datapoint:hover-out')
    })

    /* eslint-disable prefer-reflect */
    const xAxisEl = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', this.translation(0, this.size.height))
    .call(xAxis)
    /* eslint-enable prefer-reflect */

    // Remove default X axis line
    xAxisEl.select('path').remove()

  }

  render() {
    const functions = {
      drawPoints: this.drawPoints,
      calculateMargins: this.calculateMargins
    }
    const config = {
      shouldCalculateMargins: true
    }
    return (
      <D3Chart data={this.props.data} functions={functions} config={config}/>
    )
  }

}
