import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BubbleChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const diameter = [this.size.width, this.size.height]
    const color = d3.scale.category20c()

    const bubble = d3.layout.pack()
    .sort(null)
    .size(diameter)
    .padding(2)
    .value(item => parseFloat(item.values[0].tabellvariabel))

    const dimensionLabels = data.dimensions

    const filteredData = data.rows.filter(item => item.landbakgrunn != '1')

    const preparedData = nestedQueryResultLabelizer(queryResultNester(filteredData, dimensionLabels), dimensionLabels)

    const nodes = bubble.nodes({children: preparedData}).filter(item => !item.children)

    const node = this.svg.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', item => 'translate(' + item.x + ',' + item.y + ')')

    node.append('title')
    .text(item => item.title + ': ' + item.values[0].tabellvariabel)

    node.append('circle')
    .attr('r', item => item.r)
    .style('fill', item => color(item.key))

    node.append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .style('font-size', '13px')
    .text(function (item) {
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
