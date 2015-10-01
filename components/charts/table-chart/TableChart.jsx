import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

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
    const tableHeader = table.append('thead')
    const tableBody = table.append('tbody')

    // Generate TSV (for downloading, and we use this to draw the table)
    let tsv = ''
    let parsedData = []
    if (data.dimensions.length > 0) {
      // See 04-befolkning_alder-fylke-2014.csv
      const nester = d3.nest().key(item => item.fylkeNr).sortKeys(d3.ascending).key(item => data.dimensions.join(','))
      const xx = nester.entries(data.rows)
      // Headers
      tsv += 'fylkeNr'
      data.dimensions.forEach(dimension => {
        tsv += '\t'
        xx[0].values[0].values.forEach(row => {
          tsv += dimension + '.' + row[dimension] + '\t'
        })
        tsv += '\n'
      })

      xx.forEach(region => {
        tsv += region.key + '\t'
        region.values[0].values.forEach(row => {
          tsv += row.tabellvariabel + '\t'
        })
        tsv += '\n'
      })
    } else {
      // Flat render, all keys as table headers, all values as rows
      const dimensions = Object.keys(data.rows[0])
      tsv += dimensions.join('\t')
      tsv += '\n'
      data.rows.forEach(row => {
        dimensions.forEach(dim => {
          tsv += row[dim]
          tsv += '\t'
        })
        tsv += '\n'
      })
    }

    parsedData = d3.tsv.parseRows(tsv)

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
