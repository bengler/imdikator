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

export default class TableChart extends React.Component {
  drawPoints(el, data) {
    // We don't draw in the SVG in this Component
    d3.select(el).select('svg').remove()

    const table = d3.select(el).append('table')
    const tableHeader = table.append('thead')
    const tableBody = table.append('tbody')

    // Generate TSV (for downloading, and we use this to draw the table)
    // TODO: Probably not the right way to organize into table
    let tsv = String('Kategori\tSerie\tVerdi')
    tsv += '\n'
    const nestedCategories = d3.nest().key(item => item.category).key(item => item.series).entries(data)
    nestedCategories.forEach(category => {
      category.values.forEach(value => {
        tsv += category.key + '\t'
        tsv += [value.key, value.values[0].value].join('\t')
        tsv += '\n'
      })
    })

    const parsedData = d3.tsv.parseRows(tsv)

    tableHeader.append('tr')
    .selectAll('th')
    .data(parsedData[0])
    .enter()
    .append('th')
    .text(column => column)

    const rows = tableBody.selectAll('tr')
    .data(parsedData.slice(1, parsedData.length - 1))
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
      <D3Chart data={sampleData} drawPoints={this.drawPoints} />
    )
  }
}
