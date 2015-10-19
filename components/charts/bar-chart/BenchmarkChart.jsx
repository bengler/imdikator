import React from 'react'
import update from 'react-addons-update'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

function sortData(data, direction) {
  const sortedRows = data.rows.slice().sort((rowA, rowB) => {
    const varA = rowA.tabellvariabel
    const varB = rowB.tabellvariabel
    return direction == 'ascending' ? (varA - varB) : (varB - varA)
  })
  return update(data, {
    rows: {$set: sortedRows}
  })
}

export default class BenchmarkChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    className: React.PropTypes.string,
    sortDirection: React.PropTypes.string
  }

  drawPoints(el, data) {

    if (!data) {
      return
    }

    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg
    const interimSpacingFactor = 0.15
    const endMarginFactor = 0.2
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], interimSpacingFactor, endMarginFactor)
    x.domain(preparedData.map(dataItem => dataItem.title))
    const yc = this.configureYscale(d3.extent(data.rows, item => parseFloat(item.value)), data.unit)
    const y = yc.scale
    if (data.rows.length > 1) {
      // Want the max value to be the end of the domain here
      y.domain([y.domain()[0], preparedData.maxValue])
    }
    const labelFormat = yc.format

    const labels = []
    // TODO: Move these colors out to CSS?
    preparedData.forEach((dataItem, i) => {
      dataItem.fill = '#9fd59f'
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
          const color = '#438444'
          dataItem.fill = color
          labels.push({
            x: x(dataItem.title),
            y: y(dataItem.values[0].value),
            text: labelFormat(dataItem.values[0].value),
            color: color
          })
        }
      }
    })

    svg.append('rect')
    .attr('class', 'benchmarkBackground')
    .attr('width', '100%')
    .attr('height', '100%')

    // Y "axis"
    const fontSize = 12

    yc.scale.nice() // To include the last tick
    const yAxis = d3.svg.axis().scale(yc.scale).orient('left')
    .ticks(5)
    .tickFormat(yc.axisFormat)
    .innerTickSize(0)
    .outerTickSize(0)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .select('path').remove()

    // Draw horizontal background lines where the tick marks are
    svg.selectAll('.axis .tick')
    .append('line')
    .attr('class', 'benchmark--line')
    .attr('x1', -this.margins.left)
    .attr('x2', this.size.width)
    .attr('y1', 0)
    .attr('y2', 0)

    // Translate the text up by half font size to make the text rest on top
    // of the background lines
    svg.selectAll('.axis .tick text')
    .attr('transform', `translate(0,-${fontSize / 2})`)
    .attr('class', 'benchmark--text')

    // Draw the bars
    svg.selectAll('rect.glanceBar')
    .data(preparedData)
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
    .data(preparedData)
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

    // Draw any labels (any datapoint that has highlight === true)
    svg.selectAll('.label').data(labels).enter()
    .append('text')
    .attr('dx', dataItem => dataItem.x + x.rangeBand() / 2)
    .attr('dy', dataItem => {
      return dataItem.y - fontSize
    })
    .attr('width', dataItem => x.rangeBand())
    .style('text-anchor', 'middle')
    .style('font-size', `${String(fontSize)}px`)
    .text(dataItem => dataItem.text)
    .style('fill', dataItem => dataItem.fill)
    .style('pointer-events', 'none')

    // Draw the bottom background line again on top of the bars
    // since there is no z-index on svg elements
    svg
    .append('line')
    .attr('class', 'benchmark--line')
    .attr('x1', 0)
    .attr('x2', this.size.width)
    .attr('y1', this.size.height)
    .attr('y2', this.size.height)
  }

  render() {
    const sortDirection = this.props.sortDirection
    const data = sortDirection ? sortData(this.props.data, sortDirection) : this.props.data
    return (
      <D3Chart data={data} drawPoints={this.drawPoints} className={this.props.className}/>
    )
  }
}
