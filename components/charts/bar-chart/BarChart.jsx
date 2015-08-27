import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

// A cycling range of colors
// Should be shared among the different Charts
const seriesColor = d3.scale.ordinal().range(['rgb(25, 134, 224)', 'rgb(226, 57, 57)'])

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
  {
    category: 'Arbeidsinnvandrere',
    series: [{name: 'Menn', value: 50}, {name: 'Kvinner', value: 10}]
  },
  {
    category: 'Familieforente',
    series: [{name: 'Menn', value: 30}, {name: 'Kvinner', value: 15}]
  },
  {
    category: 'Flyktninger og familiegjenforente til disse',
    series: [{name: 'Menn', value: 75}, {name: 'Kvinner', value: 45}]
  },
  {
    category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner',
    series: [{name: 'Menn', value: 20}, {name: 'Kvinner', value: 45}]
  }
]

export default class BarChart extends React.Component {
  drawPoints(el, scales, data) {

    // this.svg
    // this.size
    // this.margins

    const svg = this.svg

    // Get the unique categories from the data
    const categories = d3.set(data.map(obj => obj.category)).values()
    const seriesSet = d3.set()
    data.forEach(c => c.series.map(s => seriesSet.add(s.name)))
    const series = seriesSet.values()

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
    // Percent should always be [0,100]
    const yScale = d3.scale.linear().domain([0, 100]).range([this.size.height, 0])
    // Percent should always have 10 ticks
    const yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10)
    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    const category = svg.selectAll('.category')
    .data(data)
    .enter().append('g')
    .attr('class', 'category')
    .attr('transform', d => 'translate(' + x0(d.category) + ',0)')

    category.selectAll('rect')
    .data(d => d.series)
    .enter().append('rect')
    .attr('width', x1.rangeBand())
    .attr('x', d => x1(d.name))
    .attr('y', d => yScale(d.value))
    .attr('height', d => this.size.height - yScale(d.value))
    .style('fill', d => seriesColor(d.name))

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

  // Not using this func here
  scales(el, domain) {
  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints} scales={this.scales}/>
    )
  }
}

