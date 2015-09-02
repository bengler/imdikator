import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [
  {category: 'Hele befolkningen', series: 'Menn', dimention: '0-18', value: 50000},
  {category: 'Hele befolkningen', series: 'Menn', dimention: '19-30', value: 128000},
  {category: 'Hele befolkningen', series: 'Menn', dimention: '30-50', value: 566000},
  {category: 'Hele befolkningen', series: 'Menn', dimention: '50-80', value: 11000},
  {category: 'Hele befolkningen', series: 'Menn', dimention: '80+', value: 23000},

  {category: 'Hele befolkningen', series: 'Kvinner', dimention: '0-18', value: 45000},
  {category: 'Hele befolkningen', series: 'Kvinner', dimention: '19-30', value: 98000},
  {category: 'Hele befolkningen', series: 'Kvinner', dimention: '30-50', value: 620000},
  {category: 'Hele befolkningen', series: 'Kvinner', dimention: '50-80', value: 150000},
  {category: 'Hele befolkningen', series: 'Kvinner', dimention: '80+', value: 52500},

  {category: 'Innvandrere', series: 'Menn', dimention: '0-18', value: 12800},
  {category: 'Innvandrere', series: 'Menn', dimention: '19-30', value: 32000},
  {category: 'Innvandrere', series: 'Menn', dimention: '30-50', value: 66000},
  {category: 'Innvandrere', series: 'Menn', dimention: '50-80', value: 18000},
  {category: 'Innvandrere', series: 'Menn', dimention: '80+', value: 4500},

  {category: 'Innvandrere', series: 'Kvinner', dimention: '0-18', value: 12800},
  {category: 'Innvandrere', series: 'Kvinner', dimention: '19-30', value: 32000},
  {category: 'Innvandrere', series: 'Kvinner', dimention: '30-50', value: 66000},
  {category: 'Innvandrere', series: 'Kvinner', dimention: '50-80', value: 18000},
  {category: 'Innvandrere', series: 'Kvinner', dimention: '80+', value: 4500},

  {category: 'Befolkningen ellers', series: 'Menn', dimention: '0-18', value: 12800},
  {category: 'Befolkningen ellers', series: 'Menn', dimention: '19-30', value: 32000},
  {category: 'Befolkningen ellers', series: 'Menn', dimention: '30-50', value: 66000},
  {category: 'Befolkningen ellers', series: 'Menn', dimention: '50-80', value: 18000},
  {category: 'Befolkningen ellers', series: 'Menn', dimention: '80+', value: 4500},

  {category: 'Befolkningen ellers', series: 'Kvinner', dimention: '0-18', value: 12800},
  {category: 'Befolkningen ellers', series: 'Kvinner', dimention: '19-30', value: 32000},
  {category: 'Befolkningen ellers', series: 'Kvinner', dimention: '30-50', value: 66000},
  {category: 'Befolkningen ellers', series: 'Kvinner', dimention: '50-80', value: 18000},
  {category: 'Befolkningen ellers', series: 'Kvinner', dimention: '80+', value: 4500},
]

export default class PyramidChart extends React.Component {
  drawPoints(el, data) {
    const svg = this.svg

    const nesting = d3.nest().key(entry => entry.category).key(entry => entry.series).key(entry => entry.dimention)
    const entries = nesting.entries(data)
    const categories = entries.map(entry => entry.key)

    const dimentions = d3.nest().key(entry => entry.dimention).entries(data).map(entry => entry.key)

    const seriesNames = d3.nest().key(entry => entry.series).entries(data).map(entry => entry.key)

    const color = d3.scale.category20().domain(seriesNames)

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    // X axis scale for series
    const x1 = d3.scale.ordinal()
    x1.domain(seriesNames).rangeRoundBands([0, x0.rangeBand()], 0.1)

    // X axis scale for values in a series
    const x2 = d3.scale.linear()
    const minMax = [0, d3.max(data.map(d => d.value))]
    x2.domain(minMax).range([0, x1.rangeBand()])

    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('.tick text')
      .call(this.wrapTextNode, x0.rangeBand())

    // Y axis scale for dimentions
    const y0 = d3.scale.ordinal().domain(dimentions).rangeRoundBands([this.size.height, 0], 0.25)

    // Add the y axis
    const yAxis = d3.svg.axis().scale(y0).orient('left')
    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', '.5em')
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Aldersgruppe') // TODO: Get this unit from data

    const category = svg.selectAll('.category')
    .data(entries)
    .enter().append('g')
    .attr('class', dataItem => 'category')
    .attr('transform', d => 'translate(' + x0(d.key) + ',0)')

    const series = category.selectAll('.series')
    .data(d => d.values)
    .enter().append('g')
    .attr('class', dataItem => 'series')
    .attr('alt', dataItem => dataItem.key)
    .attr('transform', (dataItem, index) => {
      const xTranslate = x1(dataItem.key)
      return 'translate(' + xTranslate + ',0)'
    })

    series.selectAll('rect')
    .data(d => d.values)
    .enter().append('rect')
    .attr('height', dataItem => y0.rangeBand())
    .attr('width', dataItem => {
      const value = dataItem.values[0].value
      return x2(value)
    })
    .attr('x', (dataItem, index) => {
      const seriesIndex = seriesNames.indexOf(dataItem.values[0].series)
      const value = dataItem.values[0].value
      if (seriesIndex == 0) {
        return x1.rangeBand() - x2(value)
      }
      return x1(dataItem.key)
    })

    .attr('y', d => y0(d.key))
    .style('fill', dataItem => {
      const seriesName = dataItem.values[0].series
      return color(seriesName)
    })

  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints}/>
    )
  }

}
