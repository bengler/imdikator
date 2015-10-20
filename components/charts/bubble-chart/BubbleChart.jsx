import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'
import {queryResultFilter} from '../../../lib/queryResultFilter'
import {colorLabels} from '../../../data/colorPalette'

export default class BubbleChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const diameter = [this.size.width, this.size.height]
    if (data.dimensions.indexOf('region') == -1) {
      data.dimensions.unshift('region')
    }
    const color = this.colors

    const dimensionLabels = data.dimensions

    const filteredData = queryResultFilter(data.rows, 'bubble')
    const preparedData = nestedQueryResultLabelizer(queryResultNester(filteredData, dimensionLabels), dimensionLabels)

    const multipleRegions = preparedData.length > 1
    // Prepare needed data
    preparedData.forEach(row => {
      row.fill = color(row.title)
      row.textFill = colorLabels[row.fill]
      row.strokeWidth = multipleRegions ? 1 : 0
      row.stroke = 'none'
      row.values.forEach(val => {
        if (val.values[0].anonymized) {
          val.fill = 'white'
          val.textFill = 'black'
        } else {
          val.fill = color(val.key)
          val.textFill = colorLabels[val.fill]
        }
      })
      row.children = row.values.map(item => {
        const anon = item.values[0].anonymized
        let formattedValue = item.values[0].formattedValue
        if (!formattedValue) {
          formattedValue = item.values[0].value
        }
        return {
          title: item.title,
          formattedValue: formattedValue,
          value: anon ? 4 : item.values[0].value,
          stroke: anon ? color(item.key) : 'none',
          fill: anon ? 'white' : color(item.key),
          strokeWidth: anon ? 1 : 0,
          textFill: item.textFill
        }
      })
    })

    const bubble = d3.layout.pack()
    .sort(null)
    .size(diameter)
    .padding(2)

    const nodes = bubble.nodes({fill: 'white', children: preparedData})

    const node = this.svg.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', item => 'translate(' + item.x + ',' + item.y + ')')

    node.append('circle')
    .attr('r', item => item.r)
    .style('fill', item => item.fill)
    .style('fill-opacity', item => {
      if (item.depth < 2) {
        return '0.1'
      }
      return '1'
    })
    .style('stroke', item => item.stroke)
    .style('stroke-width', item => item.strokeWidth)
    .each(function (dataItem) {
      dataItem.el = this
    })
    .on('mouseover', item => {
      if (item.depth < 1) {
        return
      }
      if (item.depth == 1 && !multipleRegions) {
        return
      }
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: item.formattedValue,
        el: item.el
      })
    })
    .on('mouseout', item => {
      if (item.depth < 1) {
        return
      }
      this.eventDispatcher.emit('datapoint:hover-out')
    })

    node.append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .style('font-size', '13px')
    .style('fill', item => item.textFill)
    .style('pointer-events', 'none')
    .text(item => {
      if (item.depth <= 1 || !item.title) {
        return null
      }
      return item.title.substring(0, item.r / 4)
    })
  }

  render() {
    const functions = {
      drawPoints: this.drawPoints
    }
    return (
      <D3Chart
        data={this.props.data}
        functions={functions}
        />
    )
  }
}
