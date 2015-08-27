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
    const categories = d3.set(data.map(obj => obj.category)).values()
    const seriesSet = d3.set()
    data.forEach(c => c.series.map(s => seriesSet.add(s.name)))
    const series = seriesSet.values()

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
    .attr('height', d => size.height - yScale(d.value))
    .style('fill', d => seriesColor(d.name))

    // Legend

    const legend = svg.selectAll('.legend')
    .data(series.slice())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')')

    legend.append('rect')
    .attr('x', size.width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', seriesColor)

    legend.append('text')
    .attr('x', size.width - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(d => d)
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

