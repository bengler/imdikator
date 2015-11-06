import React from 'react'
import update from 'react-addons-update'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'
import {benchmarkColor, benchmarkHighLightColor} from '../../../data/colorPalette'
import CHARTS_CONFIG from '../../../config/chartsConfigs'

function sortData(data, direction) {
  const sortedRows = data.rows.slice().sort((rowA, rowB) => {
    const varA = rowA.value
    const varB = rowB.value
    return direction == 'ascending' ? (varA - varB) : (varB - varA)
  })
  return update(data, {
    rows: {$set: sortedRows}
  })
}

export default class BenchmarkChart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: React.PropTypes.object,
    className: React.PropTypes.string,
    sortDirection: React.PropTypes.string
  }
  /* eslint-enable react/forbid-prop-types */

  prepareData(data) {
    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)
    preparedData.extent = d3.extent(data.rows, item => parseFloat(item.value))
    if (data.rows.length > 1) {
      // Want the max value to be the end of the domain here
      preparedData.extent[1] = preparedData.maxValue
    }
    return {
      unit: data.unit,
      preparedData,
      highlight: data.highlight
    }
  }

  calculateHeight(el) {
    return 300
    // return el.getBoundingClientRect().width
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const svg = this.svg
    const interimSpacingFactor = 0.15
    const endMarginFactor = 0.2
    const x0 = d3.scale.ordinal().rangeRoundBands([0, this.size.width], interimSpacingFactor, endMarginFactor)
    x0.domain(data.preparedData.map(dataItem => dataItem.title))
    const yc = this.configureYscale(data.preparedData.extent, data.unit)
    const y = yc.scale
    const labelFormat = yc.format

    const x = x0.copy()
    const maxWidth = CHARTS_CONFIG.benchmark.maxBarWidth
    this.limitScaleRangeBand(x, maxWidth)

    /* eslint-disable no-warning-comments */
    // TODO: Move these colors out to CSS?
    /* eslint-enable no-warning-comments */
    data.preparedData.forEach((dataItem, i) => {
      let fill = benchmarkColor
      if (this.textures.domain().indexOf(benchmarkColor) !== -1) {
        fill = this.textures(fill)
      }
      dataItem.fill = fill
      if (dataItem.values[0].missingData) {
        dataItem.stroke = 'none'
        dataItem.strokeWidth = 0
      } else if (dataItem.values[0].anonymized) {
        dataItem.stroke = dataItem.fill
        dataItem.fill = 'none'
        dataItem.strokeWidth = 2
      } else {
        dataItem.stroke = 'none'
        dataItem.strokeWidth = 0
      }
      dataItem.value = dataItem.values[0].value
      dataItem.formattedValue = dataItem.values[0].formattedValue
      if (!dataItem.formattedValue) {
        dataItem.formattedValue = labelFormat(dataItem.value)
      }

      if (data.highlight) {
        const val = dataItem.values[0][data.highlight.dimensionName]
        if (val && data.highlight.value.indexOf(val) != -1) {
          const color = this.textures.domain().includes(benchmarkHighLightColor)
          ? this.textures(benchmarkHighLightColor) : benchmarkHighLightColor
          if (!dataItem.values[0].anonymized) {
            dataItem.fill = color
          } else {
            dataItem.stroke = color
          }
        }
      }
    })

    svg.append('rect')
    .attr('class', 'benchmarkBackground')
    .attr('width', '100%')
    .attr('height', '100%')

    // Y "axis"
    this.addYAxis(yc.scale, yc.axisFormat)

    // Draw the bars
    svg.selectAll('rect.glanceBar')
    .data(data.preparedData)
    .enter()
    .append('rect')
    .attr('class', 'glanceBar')
    .attr('x', dataItem => x(dataItem.title))
    .attr('y', dataItem => {
      return y(dataItem.value)
    })
    .attr('width', dataItem => x.rangeBand())
    .attr('height', dataItem => {
      return this.size.height - y(dataItem.value)
    })
    .style('fill', dataItem => dataItem.fill)
    .style('stroke', dataItem => dataItem.stroke)
    .style('stroke-width', dataItem => dataItem.strokeWidth)
    .each(function (item) {
      item.el = this
    })

    svg.selectAll('rect.hover')
    .data(data.preparedData)
    .enter()
    .append('rect')
    .attr('class', 'hover')
    .attr('x', dataItem => x(dataItem.title))
    .attr('y', 0)
    .attr('width', dataItem => x.rangeBand())
    .attr('height', dataItem => this.size.height)
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
  }

  render() {
    const sortDirection = this.props.sortDirection
    const functions = {
      drawPoints: this.drawPoints,
      calculateHeight: this.calculateHeight
    }
    const config = {
      shouldCalculateMargins: true
    }
    const sortedData = sortDirection ? sortData(this.props.data, sortDirection) : this.props.data
    const data = this.prepareData(sortedData)
    return (
      <D3Chart data={data} functions={functions} config={config} className={this.props.className}/>
    )
  }
}
