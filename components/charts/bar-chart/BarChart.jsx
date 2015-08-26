import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

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
  {category: 'Arbeidsinnvandrere', series: 'Kvinner', value: 30},
  {category: 'Familieforente', series: 'Menn', value: 40},
  {category: 'Familieforente', series: 'Kvinner', value: 20},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Menn', value: 20},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Kvinner', value: 20},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Menn', value: 20},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Kvinner', value: 20}
]

export default class BarChart extends React.Component {
  drawPoints(el, scales, data) {

    // Conventional margins
    // http://bl.ocks.org/mbostock/3019563
    const margin = {
      top: 30,
      left: 30,
      bottom: 50,
      right: 10
    }

    const size = {
      width: el.offsetWidth - margin.left - margin.right,
      height: el.offsetHeight - margin.top - margin.bottom
    }

    // Translating an outer 'g' so we dont have to consider margins in the rest
    // of the code
    const svg = d3.select(el).select('svg')
    .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Get the unique categories from the data
    const categories = d3.set(sampleData.map(obj => obj.category)).values()
    const series = d3.set(sampleData.map(obj => obj.series)).values()

    // X axis scale for categories
    const x0 = d3.scale.ordinal().domain(categories).rangeRoundBands([0, size.width], 0.1)

    // X axis scale for series
    const x1 = d3.scale.ordinal()
    x1.domain(series).rangeRoundBands([0, x0.rangeBand()])

    // Add the x axis legend
    const xAxis = d3.svg.axis().scale(x0).orient('bottom')
    svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + size.height + ')')
    .call(xAxis)
    .selectAll('.tick text')
      .call(wrap, x0.rangeBand())

    // Add the Y axsis
    // Percent should always be [0,100]
    const yScale = d3.scale.linear().domain([0, 100]).range([size.height, 0])
    // Percent should always have 10 ticks
    const yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10)
    svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)

    // A cycling range of colors
    const color = d3.scale.ordinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

    const category = svg.selectAll('.category')
    .data(categories)
    .enter().append('g')
    .attr('class', 'category')
    .attr('transform', d => 'translate(' + x0(d) + ',0)')

    category.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('width', x1.rangeBand())
    .attr('x', d => x1(d.series))
    .attr('y', d => yScale(d.value))
    .attr('height', d => size.height - yScale(d.value))
    .style('fill', d => color(d.series))
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

