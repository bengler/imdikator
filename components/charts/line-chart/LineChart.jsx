import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class LineChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }
  drawPoints(el, data) {
    if (!data) {
      return
    }

    const dimensionLabels = data.dimensions

    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg
    const parseDate = d3.time.format('%Y').parse

    const extent = d3.extent(data.rows, item => parseFloat(item.value))
    const yc = this.configureYscale(extent[1], data.unit)

    const x = d3.time.scale().range([0, this.size.width])
    const y = yc.scale

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')
    yAxis.tickFormat(yc.format)

    const isPercent = data.unit === 'prosent'
    const dates = []
    preparedData.forEach(item => {
      item.values.forEach(value => {
        value.date = parseDate(value.key)
        dates.push(value.date)
        value.value = parseFloat(value.values[0].tabellvariabel)
        if (isPercent) {
          // Need to do this because of how d3 percentage scale works
          // Is normally done in the queryResultNester
          value.value /= 100
        }
      })
    })

    const series = preparedData.map(item => item.title)
    const seriesColor = this.colors.domain(series)

    x.domain(d3.extent(dates))

    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + this.size.height + ')')
    .call(xAxis)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const line = d3.svg.line()
    .x(dataItem => {
      return x(dataItem.date)
    })
    .y(dataItem => y(dataItem.value))
    .defined(dataItem => !isNaN(dataItem.value))

    const ss = this.svg.selectAll('g.line-serie')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('id', dataItem => dataItem.key)
    .attr('class', 'line-serie')

    ss.selectAll('path')
    .data(dataItem => [dataItem])
    .enter()
    .append('path')
    .attr('d', function (dataItem) {
      dataItem.line = this
      return line(dataItem.values)
    })
    .attr('fill', 'none')
    .attr('stroke', dataItem => seriesColor(dataItem.title))

    const leg = this.legend()
    .color(seriesColor)
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
    .datum(series)
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
    .y(dataItem => y(dataItem.value))
    .clipExtent([[0, 0], [this.size.width, this.size.height]])

    const voronoiGroup = svg.append('g')
    .attr('class', 'voronoi')

    // Filter out any undefined points on the lines
    const voronoiPoints = preparedData.map(item => {
      const vals = item.values.filter(val => !isNaN(val.value))
      item.values = vals
      return item
    })

    const nest = d3.nest().key(item => x(item.date) + ',' + y(item.value))
    .rollup(value => value[0])
    const voronoiData = nest.entries(d3.merge(voronoiPoints.map(item => item.values)))
    .map(item => item.values)

    const popover = this.popover()
    d3.select('body').call(popover)

    voronoiGroup.selectAll('path')
    .data(voronoi(voronoiData))
    .enter().append('path')
    .attr('d', item => 'M' + item.join('L') + 'Z')
    .datum(dataItem => dataItem.point)
    .style('fill', 'none')
    .style('stroke', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

    function mouseover(item) {
      focus.attr('transform', 'translate(' + x(item.date) + ',' + y(item.value) + ')')
      focus.select('text').text(item.value)
      popover.html('<p>' + yc.format(item.value) + '</p>')
      popover.show(focus.node())
    }

    function mouseout(item) {
      focus.attr('transform', 'translate(-100,-100)')
      popover.hide()
    }
  }

  render() {
    const margins = {left: 40, top: 20, right: 40, bottom: 70}
    return (
      <D3Chart margins={margins} data={this.props.data} drawPoints={this.drawPoints}/>
    )
  }

}
