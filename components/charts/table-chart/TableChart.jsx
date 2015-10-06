import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'
import {dimensionLabelTitle} from '../../../lib/labels'

export default class TableChart extends React.Component {
  static propTypes = {
    data: React.PropTypes.object
  }
  drawPoints(el, data) {
    if (!data) {
      return
    }

    // We don't draw in the SVG in this Component
    d3.select(el).select('svg').remove()

    d3.select(el)
    .style('overflow', 'scroll')

    const table = d3.select(el).append('table')
    //const tableHeader = table.append('thead')
    const tableBody = table.append('tbody')

    const regionKeys = ['fylkeNr', 'bydelNr', 'naringsregionNr', 'kommuneNr']
    const regionKey = Object.keys(data.rows[0]).find(item => regionKeys.indexOf(item) !== -1)

    // Generate TSV (for downloading, and we use this to draw the table)
    let tsv = ''
    const separator = ','

    let parsedData = []
    if (data.dimensions.length > 0) {
      // See 04-befolkning_alder-fylke-2014.csv
      const nester = d3.nest().key(item => item[regionKey]).sortKeys(d3.ascending).key(item => data.dimensions.join(','))
      const xx = nester.entries(data.rows)
      // Headers
      tsv += regionKey + separator + 'Navn'
      data.dimensions.forEach((dimension, idx) => {
        tsv += separator
        if (idx > 0) {
          tsv += separator
        }
        xx[0].values[0].values.forEach(row => {
          tsv += dimension + '.' + row[dimension] + separator
        })
        tsv += '\n'
      })

      xx.forEach(region => {
        tsv += region.key + separator + dimensionLabelTitle(regionKey, region.key) + separator
        region.values[0].values.forEach(row => {
          tsv += row.tabellvariabel + separator
        })
        tsv += '\n'
      })
    } else {
      // Flat render, all keys as table headers, all values as rows
      const dimensions = Object.keys(data.rows[0])
      tsv += dimensions.join(separator)
      tsv += '\n'
      data.rows.forEach(row => {
        dimensions.forEach(dim => {
          tsv += row[dim]
          tsv += separator
        })
        tsv += '\n'
      })
    }

    let parser = null
    switch (separator) {
      case '\t':
        parser = d3.tsv
        break
      default:
        parser = d3.csv
    }
    parsedData = parser.parseRows(tsv)

    const rows = tableBody.selectAll('tr')
    .data(parsedData)
    .enter()
    .append('tr')

    rows.selectAll('td')
    .data(dataItem => dataItem)
    .enter()
    .append('td')
    .text(dataItem => dataItem)
  }

  render() {
    return (
      <D3Chart data={this.props.data} drawPoints={this.drawPoints} />
    )
  }
}
