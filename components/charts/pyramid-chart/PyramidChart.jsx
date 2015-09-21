import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class PyramidChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    // Helper function
    function translation(x, y) {
      return 'translate(' + x + ',' + y + ')'
    }

    // Config
    const middleMargin = 20
    const svg = this.svg

    // Prepare data
    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    // Collect unique group keys
    const groups = []
    preparedData.forEach(item => {
      item.values.forEach(val => {
        val.values.forEach(group => {
          if (groups.indexOf(group.key) == -1) {
            groups.push(group.key)
          }
        })
      })
    })

    const regions = preparedData.map(item => item.title)
    const outerXScale = d3.scale.ordinal().rangeRoundBands([0, this.size.width], 0.05, 0).domain(regions)

    const regionWidth = outerXScale.rangeBand() / 2 - middleMargin
    const pointA = regionWidth
    const pointB = outerXScale.rangeBand() - regionWidth

    const xScale = d3.scale.linear()
    .domain([0, preparedData.maxValue])
    .range([0, regionWidth])
    .nice()

    const yScale = d3.scale.ordinal()
    .domain(groups)
    .rangeRoundBands([this.size.height, 0], 0.1)

    const yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4, 0)
    .tickPadding(middleMargin - 4)

    const yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4, 0)
    .tickFormat('')

    const xAxisRight = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d3.format('d'))
    .ticks(3)

    const xAxisLeft = d3.svg.axis()
    .scale(xScale.copy().range([pointA, 0]))
    .orient('bottom')
    .tickFormat(d3.format('d'))
    .ticks(3)

    // The axis
    const outerXAxis = d3.svg.axis().scale(outerXScale)

    const outerXAxisEl = svg.append('g')
    .attr('class', 'axis')
    .call(outerXAxis)
    .attr('transform', translation(0, this.size.height))

    outerXAxisEl
    .select('path')
    .attr('display', 'none')

    outerXAxisEl
    .selectAll('line')
    .remove()

    const category = svg.selectAll('.category')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('class', 'category')
    // -25 to make way for the outerXAxis in Y space
    .attr('transform', (item, i) => translation(outerXScale(item.title), -25))

    category
    .append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle')

    category.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight)

    category.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, this.size.height))
    .call(xAxisLeft)

    category.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(pointB, this.size.height))
    .call(xAxisRight)

    // The bars

    const color = d3.scale.category20()

    // Left side
    const leftBarGroup = category.append('g')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)')

    leftBarGroup.selectAll('.bar.left')
    .data(item => {
      return item.values[0].values
    })
    .enter().append('rect')
    .attr('class', 'bar left')
    .attr('x', 0)
    .attr('y', d => yScale(d.key))
    .attr('width', d => xScale(d.values[0].value))
    .attr('height', yScale.rangeBand())
    .attr('fill', d => color('Kvinner'))

    // Right side
    const rightBarGroup = category.append('g')
    .attr('transform', translation(pointB, 0))

    rightBarGroup.selectAll('.bar.right')
    .data(item => {
      return item.values[1].values
    })
    .enter().append('rect')
    .attr('class', 'bar right')
    .attr('x', 0)
    .attr('y', d => yScale(d.key))
    .attr('width', d => xScale(d.values[0].value))
    .attr('height', yScale.rangeBand())
    .attr('fill', d => color('Menn'))

    // Legend
    const leg = this.legend().color(color)

    /*
    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})
    */

    // Add some space between the x axis labels and the legends
    const legendBottom = this.size.height + 30
    svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', () => 'translate(' + 0 + ', ' + (legendBottom) + ')')
    .datum(['Kvinner', 'Menn'])
    .call(leg)
  }

  render() {
    const margins = {left: 0, top: 20, right: 0, bottom: 80}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
    )
  }

}
