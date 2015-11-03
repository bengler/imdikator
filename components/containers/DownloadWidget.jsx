import React, {Component, PropTypes} from 'react'
import d3 from 'd3'
import {dimensionLabelTitle} from '../../lib/labels'
import PopupChoicesBox from './PopupChoicesBox'
import {downloadChoicesByRegion} from '../../lib/regionUtil'


// http://stackoverflow.com/a/29304414/194404
function download(content, fileName, mimeType) {
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


export default class DownloadWidget extends Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    data: PropTypes.object,
    region: PropTypes.object,
    allRegions: PropTypes.array
  }
  /* eslint-enable react/forbid-prop-types */

  constructor(props) {
    super()
    this.state = {}
  }


  componentWillMount() {
    this.generateCSV(this.props.data)
  }


  componentWillReceiveProps(props) {
    this.generateCSV(props.data)
  }


  generateCSV(incomingData) {
    if (!incomingData || !incomingData.rows) {
      return
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
    this.setState({csv: csv, separator: separator})
  }


  handleOpenDownloadSelect(event) {
    event.preventDefault()
    this.setState({isDownloadSelectOpen: !this.state.isDownloadSelectOpen})
  }

  renderDownloadSelect() {
    const choices = downloadChoicesByRegion(this.props.region, this.props.allRegions)
    const handApplyChoice = newValue => {
      if (this.state.csv) {
        download(this.state.csv, 'tabell.csv')
        this.setState({isDownloadSelectOpen: false})
      } else {
        alert('CSV not done baking yet :/') // eslint-disable-line no-alert
      }
    }

    const handleCancelDownloadSelect = () => this.setState({isDownloadSelectOpen: false})
    return (
      <PopupChoicesBox
        onCancel={handleCancelDownloadSelect}
        onApply={handApplyChoice}
        choices={choices}
        applyButtonText="Last ned"
        cancelButtonText="Avbryt"
        title="Velg innhold til CSV-fil"
      />
    )
  }


  render() {
    const {isDownloadSelectOpen} = this.state

    return (
      <span>
        <button type="button" className="button button--secondary button--small" onClick={this.handleOpenDownloadSelect.bind(this)}>
          <i className="icon__download"></i> Last ned
        </button>
        {isDownloadSelectOpen && this.renderDownloadSelect()}
      </span>
    )
  }
}
