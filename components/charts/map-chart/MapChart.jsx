import React from 'react'
import d3 from 'd3'
import topojson from 'topojson'
import D3Chart from '../../utils/D3Chart'

const sampleData = [
  {category: '3', series: '0301', value: 29}
]

const topology = require('./../../../data/norge.json')

export default class MapChart extends React.Component {
  drawPoints(el, data) {
    const svg = this.svg
    //var neighbors = topojson.neighbors(topology.objects.kommuner.geometries);

    const municipalities = topojson.feature(topology, topology.objects.kommuner)
    const municipality = municipalities.features.filter(element => element.id === parseInt(sampleData[0].series, 10))[0]

    const states = topojson.feature(topology, topology.objects.fylker)
    const state = states.features.filter(element => element.id == parseInt(sampleData[0].category, 10))[0]

    const projection = d3.geo.mercator()
    .scale(1)
    .translate([0, 0])

    const path = d3.geo.path().projection(projection)

    // Project to bounding box
    // http://bl.ocks.org/mbostock/4707858
    const bounds = path.bounds(state)
    const scale = 0.98 / Math.max((bounds[1][0] - bounds[0][0]) / this.size.width, (bounds[1][1] - bounds[0][1]) / this.size.height)
    const translate = [(this.size.width - scale * (bounds[1][0] + bounds[0][0])) / 2, (this.size.height - scale * (bounds[1][1] + bounds[0][1])) / 2]
    projection
    .scale(scale)
    .translate(translate)

    // Background
    svg.append('rect')
    .attr('width', this.size.width)
    .attr('height', this.size.height)
    .style('fill', 'rgb(42, 164, 242)')

    // All municipalities
    svg.selectAll('.municipality')
    .data(topojson.feature(topology, topology.objects.kommuner).features)
    .enter().append('path')
    .attr('class', dataItem => 'municipality' + dataItem.id)
    .attr('d', path)
    .style('fill', (dataItem, index) => dataItem.id == municipality.id ? 'rgb(78, 200, 34)' : 'rgb(186, 195, 204)')

    svg.selectAll('.subunit-label')
    .data(topojson.feature(topology, topology.objects.kommuner).features)
    .enter().append('text')
    .attr('class', dataItem => 'municipality-label ' + dataItem.id)
    .attr('transform', dataItem => 'translate(' + path.centroid(dataItem) + ')')
    .attr('dy', '.35em')
    .text(dataItem => dataItem.properties.name)

    // Draw borders
    svg.append('path')
    .datum(topojson.mesh(topology, state))
    .attr('d', path)
    .attr('class', 'subunit-boundary')
    .style('fill', 'none')
    .style('stroke', 'red')

    svg.append('path')
    .datum(topojson.mesh(topology, topology.objects.kommuner))
    .attr('d', path)
    .attr('class', 'subunit-boundary')
    .style('fill', 'none')
    .style('stroke', 'black')
  }

  render() {
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints}/>
    )
  }
}
