import React, {Component, PropTypes} from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class StackedBarChart extends Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: PropTypes.object
  }
  /* eslint-enable react/forbid-prop-types */

  prepareData(data) {
    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

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
        seriesNames.add(value.title)
      })
    })

    // X axis scale for categories
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], 0.1)
    const xAxis = d3.svg.axis().scale(x).orient('bottom')

    // Y config
    const extent = [0, data.preparedData.extent[1]]
    const yc = this.configureYscale(extent, data.unit)
    const y = yc.scale
    this.addYAxis(y, yc.axisFormat)

    const colors = this.textures

    x.domain(data.preparedData.map(item => item.title))

    const category = svg.selectAll('.category')
    .data(data.preparedData)
    .enter().append('g')
    .attr('class', 'category')
    .attr('transform', cat => this.translation(x(cat.title), 0))

    category.selectAll('rect')
    .data(cat => cat.values)
    .enter().append('rect')
    .attr('width', x.rangeBand())
    .attr('y', dataItem => y(dataItem.y1))
    .attr('height', dataItem => y(dataItem.y0) - y(dataItem.y1))
    .style('fill', dataItem => colors(dataItem.title))
    .each(function (item) {
      item.el = this
    })
    .attr('pointer-events', 'all')
    .on('mouseover', item => {
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: yc.format(item.y),
        el: item.el
      })
    })
    .on('mouseout', () => {
      this.eventDispatcher.emit('datapoint:hover-out')
    })

    // Add X axis
    /* eslint-disable prefer-reflect */
    const xAxisEl = this.svg.append('g')
    .attr('class', 'axis')
    .attr('transform', this.translation(0, this.size.height))
    .call(xAxis)

    xAxisEl
    .select('path').remove()
    .selectAll('text')
    .call(this.wrapTextNode, x.rangeBand())
    /* eslint-enable prefer-reflect */

    // Legend
    const leg = this.legend().color(colors)

    // Add some space between the x axis labels and the legends
    const xAxisHeight = xAxisEl.node().getBBox().height
    const legendBottom = this.size.height + xAxisHeight

    /* eslint-disable prefer-reflect */
    const legendWrapper = svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', () => this.translation(0, legendBottom))
    .datum(seriesNames.values())
    .call(leg)
    /* eslint-enable prefer-reflect */

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
    const preparedData = this.prepareData(this.props.data)
    return (
      <D3Chart data={preparedData} functions={functions} config={config}/>
    )
  }
}
