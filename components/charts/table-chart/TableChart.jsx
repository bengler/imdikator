import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'
import {dimensionLabelTitle} from '../../../lib/labels'

// http://stackoverflow.com/a/29304414/194404
const download = function (content, fileName, mimeType) {
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

export default class TableChart extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: React.PropTypes.object
  }
  /* eslint-enable react/forbid-prop-types */

  componentWillMount() {
    this.generateCSV(this.props.data)
  }

  componentWillReceiveProps(props) {
    this.generateCSV(props.data)
  }

  generateCSV(data) {
    if (!data || !data.rows) {
      return
    }

    const regionKey = 'region'

    // Generate TSV (for downloading, and we use this to draw the table)
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
    this.setState({csv, separator})
  }

  drawPoints(el, data) {
    if (!data) {
      return
    }

    // We don't draw in the SVG in this Component
    d3.select(el).select('svg').remove()

    d3.select(el).style('overflow', 'scroll')

    d3.select(el).select('table').remove()
    const table = d3.select(el).append('table')
    //const tableHeader = table.append('thead')
    const tableBody = table.append('tbody')

    const parser = d3.dsv(data.separator, 'text/plain')
    const parsedData = parser.parseRows(data.csv)

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
    const functions = {
      drawPoints: this.drawPoints
    }
    return (
      <div>
      <D3Chart data={this.state} functions={functions} />
      {(() => {
        if (this.state && this.state.csv) {
          return (
            <a onClick={() => {
              if (this.state.csv) {
                download(this.state.csv, 'tabell.csv')
              }
            }}>
            Last ned data
            </a>
          )
        }
      })()}
      </div>
    )
  }
}
