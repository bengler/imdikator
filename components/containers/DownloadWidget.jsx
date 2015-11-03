import React, {Component, PropTypes} from 'react'
import PopupChoicesBox from './PopupChoicesBox'
import {downloadChoicesByRegion} from '../../lib/regionUtil'
import {generateCSV} from '../../lib/csvWrangler'


// http://stackoverflow.com/a/29304414/194404
// TODO: refactor by moving this wo csvWrangler so we dont need to duplicate it in TableChart
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
    this.setState(generateCSV(this.props.data))
  }


  componentWillReceiveProps(props) {
    this.setState(generateCSV(props.data))
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
