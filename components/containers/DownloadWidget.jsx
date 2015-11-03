import React, {Component, PropTypes} from 'react'
import PopupChoicesBox from './PopupChoicesBox'
import {downloadChoicesByRegion} from '../../lib/regionUtil'
import {generateCSV, downloadCSV} from '../../lib/csvWrangler'


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
        downloadCSV(this.state.csv, 'tabell.csv')
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
