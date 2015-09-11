import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BubbleChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    dimensions: React.PropTypes.array,
    unit: React.PropTypes.string
  }

  drawPoints(el, data, dimensions, unit) {
    if (!data) {
      return
    }

    const diameter = d3.min([this.size.width, this.size.height])
    const color = d3.scale.category20c()

    const bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(2)
    .value(item => parseFloat(item.values[0].tabellvariabel))

    const dimensionLabels = dimensions.map(dim => dim.label)
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data, dimensionLabels), dimensionLabels)

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
  }

  render() {
    const margins = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
    return (
      <D3Chart data={this.props.data} dimensions={this.props.dimensions} unit={this.props.unit} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}
