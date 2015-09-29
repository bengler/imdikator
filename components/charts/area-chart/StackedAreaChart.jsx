import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

/**
 * Only for development
 */
export default class StackedAreaChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }
  drawPoints(el, data) {
    if (!data) {
      return
    }

    const svg = this.svg

    const dimensionLabels = data.dimensions
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const parseDate = d3.time.format('%Y').parse

    const x = d3.time.scale().range([0, this.size.width])
    const yc = this.configureYscale(preparedData.maxValue, data.unit)
    const y = yc.scale

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')
    yAxis.tickFormat(yc.format)

    const area = d3.svg.area()
    .x(dataItem => x(dataItem.date))
    .y0(dataItem => y(dataItem.y0))
    .y1(dataItem => y(dataItem.y0 + dataItem.y))

    const dates = []
    preparedData.forEach(item => {
      item.values.forEach(value => {
        value.date = parseDate(value.key)
        dates.push(value.date)
        value.value = parseFloat(value.values[0].tabellvariabel)
      })
    })

    // Preapre properties for the area() function
    preparedData.forEach(series => {
      series.total = 0
      series.values.forEach(val => {
        val.y = val.values[0].value
        series.total += val.y
      })
    })

    // Scale the X axis by the date range in the data
    x.domain(d3.extent(dates))

    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + this.size.height + ')')
    .call(xAxis)

    // Stack our data
    const stack = d3.layout.stack()
    stack.values(dataItem => dataItem.values)
    const series = stack(preparedData)

    const color = this.colors.domain(series.map(s => s.title))

    if (data.format !== 'prosent') {
      // Scale the y axis based on the maximum stacked value
      let maxStackedValue = 0
      series.forEach(cat => {
        cat.values.forEach(item => {
          const sum = item.y0 + item.y
          if (sum > maxStackedValue) {
            maxStackedValue = sum
          }
        })
      })
      y.domain([0, maxStackedValue])
    }

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    svg.selectAll('.area')
    .data(series)
    .enter()
    .append('g')
    .append('path')
    .attr('class', 'area')
    .attr('d', dataItem => area(dataItem.values))
    .style('fill', dataItem => color(dataItem.title))
    .style('stroke', 'none')

    // legend
    const leg = this.legend()
    .color(color)
    .attr('width', () => 15)
    .attr('height', () => 15)

    leg.dispatch.on('legendClick', (item, index) => {})
    leg.dispatch.on('legendMouseout', (item, index) => {})
    leg.dispatch.on('legendMouseover', (item, index) => {})

    // Add some space between the x axis labels and the legends
    const legendBottom = this.size.height + 30
    svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('width', this.size.width)
    // Place it at the very bottom
    .attr('transform', () => 'translate(' + 0 + ', ' + (legendBottom) + ')')
    .datum(series.map(serie => serie.title))
    .call(leg)

    // Voronoi Tesselation hover points
    const focus = svg.append('g')
    .attr('transform', 'translate(-100,-100)')
    .attr('class', 'focus')
    focus.append('circle')
    .attr('r', 3.5)

    // Add a voronoi tesselation for mouseover
    const voronoi = d3.geom.voronoi()
    .x(dataItem => x(dataItem.date))
    .y(dataItem => {
      return y(dataItem.y + dataItem.y0)
    })
    .clipExtent([[0, 0], [this.size.width, this.size.height]])

    const voronoiGroup = svg.append('g')
    .attr('class', 'voronoi')

    // Filter out any undefined points on the lines
    const voronoiPoints = series.map(item => {
      const vals = item.values.filter(val => !isNaN(val.value))
      item.values = vals
      return item
    })

    const nest = d3.nest().key(item => {
      return x(item.date) + ',' + y(item.y + item.y0)
    })
    .rollup(value => value[0])
    const voronoiData = nest.entries(d3.merge(voronoiPoints.map(item => item.values)))
    .map(item => item.values)

    const popover = this.popover()
    d3.select('body').call(popover)

    voronoiGroup.selectAll('path')
    .data(voronoi(voronoiData))
    .enter()
    .append('path')
    .attr('d', item => 'M' + item.join('L') + 'Z')
    .datum(dataItem => dataItem.point)
    .style('fill', 'none')
    .style('stroke', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', item => {
      const xPos = x(item.date)
      const yPos = y(item.y + item.y0)
      focus.attr('transform', this.translation(xPos, yPos))
      popover.html('<p>' + item.key + ': ' + yc.format(item.y) + '</p>')
      popover.show(focus.node())
    })
    .on('mouseout', () => {
      popover.hide()
    })
  }

  render() {
    const margins = {left: 50, top: 10, right: 50, bottom: 100}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
    )
  }

}
