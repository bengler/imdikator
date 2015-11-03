import d3 from 'd3'
import {dimensionLabelTitle} from './labels'


export function generateCSV(incomingData) {
  if (!incomingData || !incomingData.rows) {
    return {}
  }

  const data = Object.assign({}, incomingData, {
    dimensions: incomingData.dimensions.slice(),
    rows: incomingData.rows.slice()
  })

  const regionKey = 'region'

  // Generate CSV (for downloading, and we use this to draw the table)
  let csv = ''
  const separator = ';'

  if (data.dimensions.length > 0) {
    if (data.dimensions.indexOf(regionKey) != -1) {
      data.dimensions.shift()
    }
    // See 04-befolkning_alder-fylke-2014.csv
    const nester = d3.nest()
      .key(item => item[regionKey])
      .sortKeys(d3.ascending)
      .key(item => data.dimensions.join(','))

    const xx = nester.entries(data.rows)
    // Headers

    csv += `${regionKey}${separator}Navn`
    data.dimensions.forEach((dimension, idx) => {
      csv += separator
      if (idx > 0) {
        csv += separator
      }
      xx[0].values[0].values.forEach(row => {
        csv += dimensionLabelTitle(dimension, row[dimension]) + separator
      })
      csv += '\n'
    })

    xx.forEach(region => {
      csv += region.key
                .slice(1, region.key.length)
              + separator
              + dimensionLabelTitle(regionKey, region.key)
              + separator
      region.values[0].values.forEach(row => {
        csv += row.tabellvariabel + separator
      })
      csv += '\n'
    })
  } else {
    // Flat render, all keys as table headers, all values as rows
    const dimensions = Object.keys(data.rows[0])
    csv += dimensions.join(separator)
    csv += '\n'
    data.rows.forEach(row => {
      dimensions.forEach(dim => {
        csv += row[dim]
        csv += separator
      })
      csv += '\n'
    })
  }
  return {csv: csv, separator: separator}
}
