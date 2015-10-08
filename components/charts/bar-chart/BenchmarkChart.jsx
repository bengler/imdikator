import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BenchmarkChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    className: React.PropTypes.string
  }

  drawPoints(el, data) {

    if (!data) {
      return
    }

    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg
    const interimSpacingFactor = 0.025
    const endMarginFactor = 0
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], interimSpacingFactor, endMarginFactor)
    x.domain(preparedData.map(dataItem => dataItem.title))
    const y = d3.scale.linear().range([this.size.height, 0])

    const isPercent = data.unit === 'prosent'
    let labelFormat = d3.format('d')
    if (isPercent) {
      y.domain([0, 1])
      labelFormat = d3.format('%')
    } else {
      y.domain([0, preparedData.maxValue])
    }

    const labels = []
    // TODO: Move these colors out to CSS?
    preparedData.forEach((dataItem, i) => {
      if (dataItem.values[0].missingData) {
      } else if (dataItem.values[0].anonymized) {

      } else {
        dataItem.value = dataItem.values[0].value
        dataItem.formattedValue = labelFormat(dataItem.value)
      }

      if (dataItem.values[0].highlight === true) {
        const color = 'red'
        dataItem.color = color
        labels.push({
          x: x(dataItem.title),
          y: y(dataItem.values[0].value),
          text: labelFormat(dataItem.values[0].value),
          color: color
        })
      } else {
        dataItem.color = 'rgb(144, 165, 178)'
      }
    })

    svg.append('rect')
    .attr('class', 'benchmarkBackground')
    .attr('width', '100%')
    .attr('height', '100%')

    if (isPercent) {
      // Draw the lines per 10% in the background
      const lines = d3.range(y.domain()[0], y.domain()[1], d3.max(y.domain()) / 10)
      svg.selectAll('.line').data(lines).enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', dataItem => this.size.width)
      .attr('y1', dataItem => y(dataItem))
      .attr('y2', dataItem => y(dataItem))
      .style('stroke', 'white')
    }

    // Draw the bars
    svg.selectAll('rect.glanceBar')
    .data(preparedData)
    .enter()
    .append('rect')
    .attr('class', 'glanceBar')
    .attr('x', dataItem => x(dataItem.title))
    .attr('y', dataItem => {
      return y(dataItem.values[0].value)
    })
    .attr('width', dataItem => x.rangeBand())
    .attr('height', dataItem => {
      return this.size.height - y(dataItem.values[0].value)
    })
    .style('fill', dataItem => dataItem.color)
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
    const fontSize = 14
    svg.selectAll('.label').data(labels).enter()
    .append('text')
    .attr('dx', dataItem => dataItem.x + x.rangeBand() / 2)
    .attr('dy', dataItem => {
      return dataItem.y - fontSize
    })
    .attr('width', dataItem => x.rangeBand())
    .style('text-anchor', 'middle')
    .style('font-size', String(fontSize) + 'px')
    .text(dataItem => dataItem.text)
    .style('fill', dataItem => dataItem.color)
  }

  render() {
    const margins = {left: 0, top: 0, right: 0, bottom: 0}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins} className={this.props.className}/>
    )
  }
}
