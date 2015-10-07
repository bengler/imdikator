import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'
import {queryResultFilter} from '../../../lib/queryResultFilter'

export default class BubbleChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const diameter = [this.size.width, this.size.height]
    const color = this.colors

    const bubble = d3.layout.pack()
    .sort(null)
    .size(diameter)
    .padding(2)

    const dimensionLabels = data.dimensions

    const filteredData = queryResultFilter(data.rows, 'bubble')
    const preparedData = nestedQueryResultLabelizer(queryResultNester(filteredData, dimensionLabels), dimensionLabels)

    // Prepare needed data
    preparedData.forEach(row => {
      if (row.values[0].anonymized) {
        row.value = 4
        row.fill = 'white'
        row.strokeWidth = '1'
        row.stroke = color(row.key)
      } else {
        row.value = row.values[0].value
        row.fill = color(row.key)
        row.strokeWidth = '0'
        row.stroke = 'none'
      }
    })

    const nodes = bubble.nodes({children: preparedData}).filter(item => !item.children)

    const node = this.svg.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', item => 'translate(' + item.x + ',' + item.y + ')')

    node.append('circle')
    .attr('r', item => item.r)
    .style('fill', item => item.fill)
    .style('stroke', item => item.stroke)
    .style('stroke-width', item => item.strokeWidth)
    .each(function (dataItem) {
      dataItem.el = this
    })
    .on('mouseover', item => {
      this.eventDispatcher.emit('datapoint:hover-in', {
        title: item.title,
        body: item.values[0].value,
        el: item.el
      })
    })
    .on('mouseout', () => {
      this.eventDispatcher.emit('datapoint:hover-out')
    })

    node.append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .style('font-size', '13px')
    .style('pointer-events', 'none')
    .text(item => {
      return item.title.substring(0, item.r / 4)
    })
  }

  render() {
    const margins = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
    return (
      <D3Chart className="bubble"
        data={this.props.data}
        drawPoints={this.drawPoints}
        margins={margins}/>
    )
  }
}
