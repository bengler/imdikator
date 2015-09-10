import React, {Component, PropTypes} from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

export default class StackedBarChart extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  // Called in context of _d3Chart
  drawPoints(el, data) {

    if (!data || !data.hasOwnProperty('data') || !data.hasOwnProperty('unit')) {
      return
    }

    const isPercent = data.unit === 'percent'

    // this.svg
    // this.size
    // this.margins
    // A range of 20 colors
    const colors = d3.scale.category20()

    const svg = this.svg

    // Get the unique categories from the data
    const yAxisLabelFormat = isPercent ? d3.format('%') : d3.format('d')

    const seriesKeys = []
    data.data.forEach(category => {
      let y0 = 0
      let total = 0
      category.values.forEach(serie => {
        if (seriesKeys.indexOf(serie.key) == -1) {
          seriesKeys.push(serie.key)
        }
        const val = isPercent ? serie.values / 100 : serie.values
        total += val
        Object.assign(serie, {
          y0: y0,
          y1: y0 += +val
        })
      })
      category.total = total
    })

    colors.domain(seriesKeys)

    // X axis scale for categories
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], 0.1)
    const y = d3.scale.linear().rangeRound([this.size.height, 0])

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    .tickFormat((key, index) => data.data[index].title)

    const yAxis = d3.svg.axis().scale(y).orient('left')

    yAxis.tickFormat(yAxisLabelFormat)
    if (isPercent) {
      y.domain([0, 1])
    } else {
      y.domain([0, d3.max(data.data, cat => cat.total)])
    }

    const yAxisEl = this.svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    x.domain(data.data.map(category => category.key))

    this.svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('text')
    .call(this.wrapTextNode, x.rangeBand())

    if (!isPercent) {
      yAxisEl.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', '.5em')
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(data.unit)
    }

    const category = svg.selectAll('.state')
    .data(data.data)
    .enter().append('g')
    .attr('class', 'g')
    .attr('transform', cat => 'translate(' + x(cat.key) + ',0)')

    category.selectAll('rect')
    .data(cat => cat.values)
    .enter().append('rect')
    .attr('width', x.rangeBand())
    .attr('y', dataItem => y(dataItem.y1))
    .attr('height', dataItem => y(dataItem.y0) - y(dataItem.y1))
    .style('fill', dataItem => colors(dataItem.key))
    .append('title')
    .text(dataItem => dataItem.title + ': ' + yAxisLabelFormat(dataItem.values))
  }

  render() {
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} />
    )
  }
}
