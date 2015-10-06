import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'
import Hoverbox from '../../elements/Hoverbox'

import {queryResultNester, nestedQueryResultLabelizer} from '../../../lib/queryResultNester'

export default class BarChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    const dimensionLabels = data.dimensions
    if (dimensionLabels.length == 1) {
      // Add a needed second dimension
      dimensionLabels.push('enhet')
    }
    const preparedData = nestedQueryResultLabelizer(queryResultNester(data.rows, dimensionLabels), dimensionLabels)

    const svg = this.svg

    // Get the unique categories from the data
    const categories = preparedData.map(entry => entry.title)
    const series = []
    preparedData.forEach(item => {
      item.values.forEach(val => {
        if (series.indexOf(val.title) == -1) {
          series.push(val.title)
        }
      })
    })

    // A range of 20 colors
    const seriesColor = this.colors.domain(series)

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    // X axis scale for series
    const x1 = d3.scale.ordinal()
    x1.domain(series).rangeRoundBands([0, x0.rangeBand()], 0.05)

    // Y config
    const yc = this.configureYscale(preparedData.maxValue, data.unit)
    // Add the Y axsis
    const yAxis = d3.svg.axis().scale(yc.scale).orient('left')
    yAxis.tickFormat(yc.format)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const category = svg.selectAll('.category')
    .data(preparedData)
    .enter()
    .append('g')
    .attr('class', 'category')
    .attr('transform', d => 'translate(' + x0(d.title) + ',0)')

    category.selectAll('rect.bar')
    .data(d => d.values)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('width', x1.rangeBand())
    .attr('x', dataItem => x1(dataItem.title))
    .attr('y', d => {
      const val = d.values[0].value
      if (isNaN(val)) {
        return 0
      }
      return yc.scale(val)
    })
    .attr('height', d => {
      const val = d.values[0].value
      if (isNaN(val)) {
        return 0
      }
      return this.size.height - yc.scale(val)
    })
    .style('fill', dataItem => seriesColor(dataItem.title))
    .each(function (item) {
      item.el = this
    })

    category.selectAll('rect.hover')
    .data(d => d.values)
    .enter().append('rect')
    .attr('class', 'hover')
    .attr('width', x1.rangeBand())
    .attr('x', dataItem => x1(dataItem.title))
    // Want full height for this one
    .attr('y', 0)
    .attr('height', () => this.size.height - yc.scale(yc.scale.domain()[1]))
    .attr('pointer-events', 'all')
    .style('fill', 'none')
    .on('mouseover', item => {
      this.eventDispatcher.emit('datapoint:hover', {
        title: item.title,
        body: yc.format(item.values[0].value),
        el: item.el
      })
    })
    .on('mouseout', () => {
    })

    const leg = this.legend()
    .color(seriesColor)

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
    .datum(series)
    .call(leg)

    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('.tick text')
    .call(this.wrapTextNode, x0.rangeBand())

  }

  render() {
    const margins = {left: 60, top: 10, right: 40, bottom: 80}
    return (
      <div>
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} margins={margins}/>
      </div>
    )
  }
}
