import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

// A range of 20 colors
const seriesColor = d3.scale.category20()

// Wrapping text nodes
// https://gist.github.com/mbostock/7555321
function wrap(text, width) {
  text.each(function () {
    const txt = d3.select(this)
    const words = txt.text().split(/\s+/).reverse()
    const lineHeight = 1.1 // ems
    const y = txt.attr('y')
    const dy = parseFloat(txt.attr('dy'))
    let word = null
    let line = []
    let lineNumber = 0
    let tspan = txt.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em')
    word = words.pop()
    while (word) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = txt.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
      }
      word = words.pop()
    }
  })
}

/*
const tableMap = {
  sysselsatteinnvandringsgrunn: {
    title: 'Sysselsetting etter innvandringsgrunn',
    categories: {
      innvgrunn5: {
        arbeid: 'Arbeidsinnvandrere',
        familie: 'Familieforente',
        flukt: 'Flyktninger og famileforente til disse',
        annet_uoppgitt: 'Udanning (inkl. au pair), uoppgitte eller andre grunner'
      }
    }
  }
}
*/

const sampleData = [
  {category: 'Arbeidsinnvandrere', series: 'Menn', value: 50},
  {category: 'Arbeidsinnvandrere', series: 'Kvinner', value: 10},
  {category: 'Familieforente', series: 'Menn', value: 30},
  {category: 'Familieforente', series: 'Kvinner', value: 15},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Menn', value: 75},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Kvinner', value: 45},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Menn', value: 20},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Kvinner', value: 45},
]

export default class BarChart extends React.Component {
  drawPoints(el, data) {

    // this.svg
    // this.size
    // this.margins

    const svg = this.svg

    // Get the unique categories from the data
    const n = d3.nest().key(d => d.category).key(d => d.series)
    const entries = n.entries(data)
    const categories = entries.map(e => e.key)
    const series = entries[0].values.map(v => v.key)

    entries.forEach(e => {
      e.values.forEach(v => {
        v.value = v.values[0].value / 100 // Using percentage formatting, which multiplied by 100
      })
    })

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, this.size.width], 0.1)

    // X axis scale for series
    const x1 = d3.scale.ordinal()
    x1.domain(series).rangeRoundBands([0, x0.rangeBand()], 0.05)

    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + this.size.height + ')')
    .call(xAxis)
    .selectAll('.tick text')
      .call(wrap, x0.rangeBand())

    // Add the Y axsis
    const yScale = d3.scale.linear().range([this.size.height, 0])
    const yAxis = d3.svg.axis().scale(yScale).orient('left')

    // Percentage scale it (divide the values by 100)
    yAxis.tickFormat(d3.format('%'))
    yScale.domain([0, 1])

    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const category = svg.selectAll('.category')
    .data(entries)
    .enter().append('g')
    .attr('class', 'category')
    .attr('transform', d => 'translate(' + x0(d.key) + ',0)')

    category.selectAll('rect')
    .data(d => d.values)
    .enter().append('rect')
    .attr('width', x1.rangeBand())
    .attr('x', d => x1(d.key))
    .attr('y', d => {
      return yScale(d.value)
    })
    .attr('height', d => this.size.height - yScale(d.value))
    .style('fill', d => seriesColor(d.key))

    // Legend
    const labelScale = d3.scale.ordinal().domain(series).rangeRoundBands([0, this.size.width], 0.1)

    const legend = svg.selectAll('.legend')
    .data(series.slice())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', d => 'translate(' + labelScale(d) + ', ' + -(this.margins.top / 2) + ')')

    legend.append('rect')
    .attr('x', '0')
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', seriesColor)

    legend.append('text')
    .attr('x', '15')
    .attr('y', 10)
    .style('font-size', '12px')
    .text(d => d)
    .selectAll('text')
      .call(wrap, labelScale.rangeBand())
  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints} />
    )
  }
}

