import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

export default class BubbleChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data || !data.hasOwnProperty('data') || !data.hasOwnProperty('unit')) {
      return
    }

    const diameter = d3.min([this.size.width, this.size.height])
    const color = d3.scale.category20c()

    const bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(5)

    const nest = d3.nest().key(entry => entry.category).rollup(leaves => {
      return d3.sum(leaves, node => node.value)
    })
    const categoriesAndSummedSerieValues = nest.map(data.data, d3.map).entries()

    const node = this.svg.selectAll('.node')
    .data(bubble.nodes({children: categoriesAndSummedSerieValues}).filter(item => !item.children))
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', item => 'translate(' + item.x + ',' + item.y + ')')

    node.append('title')
    .text(item => item.key)

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
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}
