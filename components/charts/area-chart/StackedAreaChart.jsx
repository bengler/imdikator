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
    const y = d3.scale.linear().range([this.size.height, 0])


    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

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

    const color = d3.scale.category20()
    color.domain(series.map(s => s.title))

    const isPercent = data.unit === 'percent'
    if (isPercent) {
      // Values are percent, use 0,1
      y.domain([0, 1])
      yAxis.tickFormat(d3.format('%'))
    } else {
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
      if (data.unit === 'kroner') {
        yAxis.tickFormat(d3.format("+$,.2f"))
      } else {
        yAxis.tickFormat(d3.format('d'))
      }
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
  }

  render() {
    const margins = {left: 50, top: 10, right: 50, bottom: 100}
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
    )
  }

}
