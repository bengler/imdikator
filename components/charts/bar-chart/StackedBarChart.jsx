import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [
  {category: 'Arbeidsinnvandrere', series: 'Menn', value: 3213},
  {category: 'Arbeidsinnvandrere', series: 'Kvinner', value: 1213},
  {category: 'Familieforente', series: 'Menn', value: 2311},
  {category: 'Familieforente', series: 'Kvinner', value: 1000},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Menn', value: 7500},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Kvinner', value: 4500},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Menn', value: 6324},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Kvinner', value: 2201},
]

export default class StackedBarChart extends React.Component {
  drawPoints(el, data) {

    // this.svg
    // this.size
    // this.margins
    // A range of 20 colors
    const colors = d3.scale.category20()

    const svg = this.svg

    // Get the unique categories from the data
    const n = d3.nest().key(d => d.category).key(d => d.series)
    const entries = n.entries(data)
    const series = entries[0].values.map(v => v.key)

    entries.forEach(e => {

      let total = 0
      let y0 = 0
      e.series = e.values.map(v => {
        const value = v.values[0].value
        total += value
        return {name: v.key, y0: y0, y1: y0 += +value}
      })
      e.total = total
    })

    // X axis scale for categories
    const x = d3.scale.ordinal().rangeRoundBands([0, this.size.width], 0.1)
    const y = d3.scale.linear().rangeRound([this.size.height, 0])
    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    colors.domain(series)
    x.domain(entries.map(e => e.key))
    y.domain([0, d3.max(entries, e => e.total)])

    this.svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('text')
    .call(this.wrapTextNode, x.rangeBand())

    this.svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', '.5em')
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Personer') // TODO: Get this unit from data

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
    .text(d => d.name + ': ' + String(d.y1 - d.y0))
  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints} />
    )
  }
}
