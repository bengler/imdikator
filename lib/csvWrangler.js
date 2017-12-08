import d3 from 'd3'
import {dimensionLabelTitle} from './labels'
import {capitalize} from 'lodash'

// Generate CSV for downloading and drawing in TableChart.jsx
export function generateCSV(incomingData) {
  if (!incomingData || !incomingData.rows) {
    return {}
  }
  // copy incoming data
  // incomingData is overwritten by the second parameter- but not completely
  // the second p
  const data = Object.assign({}, incomingData, {
    dimensions: incomingData.dimensions.map(item => item.name),
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

  function compareItems(itemA, itemB) {
    const yearA = Number(itemA.aar)
    const yearB = Number(itemB.aar)
    if (yearA == yearB) {
      return itemB[leftcolumnKey] < itemA[leftcolumnKey] ? 1 : -1
    }
    return yearA < yearB ? -1 : 1
  }

  // See 04-befolkning_alder-fylke-2014.csv for the format we are constructing
  const nester = d3.nest()
    .key(item => item[leftcolumnKey])
    .sortKeys(d3.ascending)
    .sortValues(compareItems)
    .key(item => data.dimensions.join(separator))

  const rows = nester.entries(data.rows)

  // Done with the left colum
  data.dimensions.shift()

  // Collect any other dimensions
  data.dimensions.forEach((dimension, rowIndex) => {
    const dimensions = []
    if (rowIndex > 0) {
      // The first line in csv has "leftcolumnKey;Navn;"" already
      // so the other rows need to make space for them by inserting blank
      // cells in those two positions
    }

    // Now we add the labelized dimension name
    dimensions.push(`;${dimensionLabelTitle(dimension)}`) // bakgrunn

    rows[0].values[0].values.forEach(row => {
      dimensions.push(`;${dimensionLabelTitle(dimension, row[dimension])}`) // innvandrere
    })

    dimensions.forEach(item => {
      csv += item
    })
    csv += '\n'

    // here csv would be
    // ;Bakgrunn;Innvandrere;Norskfødte med innvandrerforeldre;Befolkningen utenom innvandrere og norskfødte med innvandrerforeldre
    // ;Kjønn;Alle;Alle;Alle
    // ;Enheter for tall;Personer;Personer;Personer
    //
  })


  // Now, for every data row, nested by the dimensions...
  rows.forEach(dimension => {
    // Add the first two columns, which in our example are
    // K0301;Oslo
    const firstTwoColumns = [dimension.key, dimensionLabelTitle(leftcolumnKey, dimension.key)]

    // csv += firstTwoColumns.join(separator)
    firstTwoColumns.forEach(item => {
      csv += `;${item}`
    })

    // append the rest of the columns, which are the actual values, example
    // ;12,39,etc\n
    const values = dimension.values[0].values.map(row => {
      return row.tabellvariabel
    })

    // How can this work if years are not the same length??????
    values.forEach(item => {
      csv += `;${item}`
    })
    csv += '\n'
    // `${values.join(';')}`
  })
  // CSV is now like this:
  // region;Navn;dimension1;dimension2;etc\n
  // ;;variableName1;variableName2;etc\n
  // K0301;Oslo;12;39;etc\n
  // K1505;Kristiansund;9;7;etc\n
  return {csv: csv, separator: separator}
}
