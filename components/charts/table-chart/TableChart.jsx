import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'
import {generateCSV} from '../../../lib/csvWrangler'


// http://stackoverflow.com/a/29304414/194404
// TODO: refactor by moving this wo csvWrangler so we dont need to duplicate it in DownloadWidget
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
    this.setState(generateCSV(this.props.data))
  }


  componentWillReceiveProps(props) {
    this.setState(generateCSV(props.data))
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
