import d3 from 'd3'
import {dimensionLabelTitle} from './labels'
import capitalize from 'lodash.capitalize'

// http://stackoverflow.com/a/29304414/194404
export function downloadCSV(content, fileName, mimeType) {
  const anchor = document.createElement('a')
  const _mimeType = mimeType || 'application/octet-stream'

  if (navigator.msSaveBlob) { // IE10
    const blob = new Blob([content], {type: _mimeType})
    return navigator.msSaveBlob(blob, fileName)
  } else if ('download' in anchor) { //html5 A[download]
    anchor.href = `data:${_mimeType},${encodeURIComponent(content)}`
    anchor.setAttribute('download', fileName)
    document.body.appendChild(anchor)

    setTimeout(() => {
      anchor.click()
      document.body.removeChild(anchor)
    }, 66)
  } else { //do iframe dataURL download (old ch+FF):
    const frame = document.createElement('iframe')
    document.body.appendChild(frame)
    frame.src = `data:${_mimeType},${encodeURIComponent(content)}`

    setTimeout(() => {
      document.body.removeChild(frame)
    }, 333)
  }
  return true
}


// Generate CSV for downloading and drawing in TableChart.jsx
export function generateCSV(incomingData) {
  if (!incomingData || !incomingData.rows) {
    return {}
  }

  const data = Object.assign({}, incomingData, {
    dimensions: incomingData.dimensions.slice(),
    rows: incomingData.rows.slice()
  })

  let csv = ''
  const separator = ';'

  // We need at least two dimensions to make our table
  if (data.dimensions.length < 2) {
    csv = `Error\nNeed at least two dimensions\nGot: ['${data.dimensions.join(',')}']`
    return {csv: csv, separator: separator}
  }

  // This key will be used to create the first columns (usually 'region')
  const leftcolumnKey = data.dimensions[0]

  // See 04-befolkning_alder-fylke-2014.csv for the format we are constructing
  const nester = d3.nest()
    .key(item => item[leftcolumnKey])
    .sortKeys(d3.ascending)
    .key(item => data.dimensions.join(','))

  const rows = nester.entries(data.rows)

  // Headers
  // Begin the CSV with the left column and its name
  // example:
  // "region;Navn;"
  csv += `${capitalize(leftcolumnKey)}${separator}Navn${separator}`

  // Done with the left colum
  data.dimensions.shift()
  // Collect any other dimensions
  data.dimensions.forEach((dimension, rowIndex) => {
    const dimensions = []
    if (rowIndex > 0) {
      // The first line in csv has "leftcolumnKey;Navn;"" already
      // so the other rows need to make space for them by inserting blank
      // cells in those two positions
      dimensions.push('')
      dimensions.push('')
    }
    // Now we add the labelized dimension name
    rows[0].values[0].values.forEach(row => {
      dimensions.push(dimensionLabelTitle(dimension, row[dimension]))
    })
    csv += `${dimensions.join(separator)}\n`
    // here csv would be
    // region;Navn;dimension1;dimension2;etc\n
    // after the first pass, then
    // ;;variableName1;variableName2;etc\n
    // ;;variableName1;variableName2;etc\n
    // for the rest of the dimensions/their variables
  })

  // CSV is now probably like this:
  // region;Navn;dimension1;dimension2;etc\n
  // ;;variableName1;variableName2;etc\n

  // Now, for every data row, nested by the dimensions...
  rows.forEach(dimension => {
    // Add the first two columns, which in our example are
    // K0301;Oslo
    const firstTwoColumns = [dimension.key, dimensionLabelTitle(leftcolumnKey, dimension.key)]
    csv += firstTwoColumns.join(separator)
    // append the rest of the columns, which are the actual values, example
    // ;12,39,etc\n
    const values = dimension.values[0].values.map(row => row.tabellvariabel)
    csv += `;${values.join(separator)}\n`
  })

  // CSV is now like this:
  // region;Navn;dimension1;dimension2;etc\n
  // ;;variableName1;variableName2;etc\n
  // K0301;Oslo;12;39;etc\n
  // K1505;Kristiansund;9;7;etc\n
  return {csv: csv, separator: separator}
}
