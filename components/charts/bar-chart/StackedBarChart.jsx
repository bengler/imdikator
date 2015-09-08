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
    const n = d3.nest().key(d => d.category).key(d => d.series)
    const entries = n.entries(data.data)
    const series = entries[0].values.map(v => v.key)
    const yAxisLabelFormat = isPercent ? d3.format('%') : d3.format('d')
    entries.forEach(e => {

      let total = 0
      let y0 = 0
      e.series = e.values.map(v => {
        let value = v.values[0].value
        if (isPercent) {
          value /= 100
        }
        total += value
        return {
          name: v.key,
          value: value,
          y0: y0,
          y1: y0 += +value
        }
      })
      e.total = total
    })

    // X axis scale for categories
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], 0.1)
    const y = d3.scale.linear().rangeRound([this.size.height, 0])
    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    yAxis.tickFormat(yAxisLabelFormat)
    if (isPercent) {
      y.domain([0, 1])
    } else {
      y.domain([0, d3.max(entries, entry => entry.total)])
    }

    colors.domain(series)
    x.domain(entries.map(e => e.key))

    this.svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('text')
    .call(this.wrapTextNode, x.rangeBand())

    const yAxisEl = this.svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    if (!isPercent) {
      yAxisEl.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', '.5em')
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(data.unit)
    }

    const category = svg.selectAll('.state')
    .data(entries)
    .enter().append('g')
    .attr('class', 'g')
    .attr('transform', d => 'translate(' + x(d.key) + ',0)')

    category.selectAll('rect')
    .data(d => d.series)
    .enter().append('rect')
    .attr('width', x.rangeBand())
    .attr('y', d => y(d.y1))
    .attr('height', d => y(d.y0) - y(d.y1))
    .style('fill', d => colors(d.name))
    .append('title')
    .text(d => d.name + ': ' + yAxisLabelFormat(d.value))
  }

  render() {
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} />
    )
  }
}
