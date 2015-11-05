import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import CHARTS_CONFIG from '../../../config/chartsConfigs'
import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class LineChart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: React.PropTypes.object
  }
  /* eslint-enable react/forbid-prop-types */

  prepareData(data) {
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
    const parseDate = d3.time.format('%Y').parse

    const yc = this.configureYscale(data.preparedData.extent, data.unit)

    const x = d3.time.scale().range([0, this.size.width])
    const y = yc.scale

    const xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(10)
    const yAxis = d3.svg.axis().scale(y).orient('left')
    yAxis.tickFormat(yc.axisFormat)
    yAxis.scale().nice()

    const dates = []

    const series = data.preparedData.map(item => item.title)
    const seriesColor = this.colors.domain(series)

    data.preparedData.forEach(item => {
      item.color = seriesColor(item.title)
      item.values.forEach(value => {
        value.color = item.color
        value.date = parseDate(value.key)
        value.series = item.title
        dates.push(value.date)
        value.radius = 4
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
          value.anonymized = true
          value.y = y(value.value)
        } else {
          value.y = y(value.value)
        }
        if (!value.formattedValue) {
          value.formattedValue = yc.format(value.value)
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

    if (xAxis.ticks()[0] > (this.size.width / 50)) {
      xAxis.ticks(this.size.width / 50)
    }

    this.addYAxis(yc.scale, yc.axisFormat)

    const line = d3.svg.line()
    .x(dataItem => {
      return x(dataItem.date)
    })
    .y(dataItem => dataItem.y)
    .defined(dataItem => !isNaN(dataItem.value))

    const ss = this.svg.selectAll('g.line-serie')
    .data(data.preparedData)
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
    .attr('class', 'graph__path')

    const sc = this.svg.selectAll('g.line-dot')
    .data(data.preparedData)
    .enter()
    .append('g')
    .attr('class', 'line-dot')

    sc.selectAll('circle')
    .data(dataItem => dataItem.values.filter(item => !item.anonymized))
    .enter()
    .append('circle')
    .attr('cx', dataItem => x(dataItem.date))
    .attr('cy', dataItem => dataItem.y)
    .attr('r', dataItem => dataItem.radius)
    .style('fill', dataItem => dataItem.color)

    sc.selectAll('circle.anon')
    .data(dataItem => {
      const items = []
      dataItem.values.filter(item => item.anonymized).forEach(item => {
        let idx = 0
        while (idx < 5) {
          items.push(Object.assign({}, item, {
            y: y(idx++)
          }))
        }
      })
      return items
    })
    .enter()
    .append('circle')
    .attr('cx', dataItem => x(dataItem.date))
    .attr('cy', dataItem => dataItem.y)
    .attr('r', dataItem => dataItem.radius)
    .style('stroke', dataItem => dataItem.color)
    .style('fill', 'none')

    const leg = this.legend().color(seriesColor)

    /*
    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})
    */

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
    const voronoiPoints = data.preparedData.map(item => {
      const vals = item.values.filter(val => !isNaN(val.value))
      item.values = vals
      return item
    })

    const nest = d3.nest().key(item => `${x(item.date)},${item.y}`).rollup(value => value[0])
    const voronoiData = nest.entries(d3.merge(voronoiPoints.map(item => item.values)))
    .map(item => item.values)

    let hoveropen = false
    const open = item => {
      focus
      .attr('transform', this.translation(x(item.date), item.y))
      .attr('fill', item.color)
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.series,
        body: `${item.title}: ${item.formattedValue}`,
        el: focus.node()
      })
      hoveropen = true
    }
    const close = () => {
      focus.attr('transform', 'translate(-100,-100)')
      this.eventDispatcher.emit('datapoint:hover-out')
      hoveropen = false
    }

    voronoiGroup.selectAll('path')
    .data(voronoi(voronoiData))
    .enter().append('path')
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

    /* eslint-disable prefer-reflect */
    const xAxisEl = svg.append('g')
    .attr('class', 'axis')
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
    .attr('class', 'legendWrapper')
    .attr('width', this.fullWidth)
    // Place it at the very bottom
    .attr('transform', () => this.translation(0, legendBottom))
    .datum(series)
    .call(leg)
    /* eslint-enable prefer-reflect */

    // Increase our height to fit the legend
    this._svg.attr('height', this.fullHeight + xAxisMargin + leg.height())


  }

  render() {
    const functions = {
      drawPoints: this.drawPoints,
      calculateMargins: this.calculateMargins,
    }

    const data = this.prepareData(this.props.data)
    const config = {
      shouldCalculateMargins: true,
    }

    if (CHARTS_CONFIG.line.minWidthPerCategory) {
      const numCategories = data.preparedData.length
      config.minimumWidth = numCategories * CHARTS_CONFIG.line.minWidthPerCategory
    }

    return (
      <D3Chart data={data} functions={functions} config={config}/>
    )
  }

}
