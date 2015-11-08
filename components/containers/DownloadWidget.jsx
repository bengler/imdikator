import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import PopupChoicesBox from './PopupChoicesBox'
import {downloadChoicesByRegion} from '../../lib/regionUtil'
import {generateCSV, downloadCSV} from '../../lib/csvWrangler'


class DownloadWidget extends Component {
  static propTypes = {
    data: ImdiPropTypes.chartData.isRequired,
    region: ImdiPropTypes.region.isRequired,
    allRegions: PropTypes.arrayOf(ImdiPropTypes.region)
    //choices: ImdiPropTypes.dowloadChoices
  }

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
        title="Last ned tallgrunnlag"
        choiceLabel="Velg innhold"
        description="Tallgrunnlaget kan lastes ned som en CSV fil som kan åpnes i blant annet Microsoft Excel."
      />
    )
  }


  render() {
    const {isDownloadSelectOpen} = this.state

    return (
      <span className="graph__functions-item">
        <button type="button" className="button button--secondary button--small" onClick={this.handleOpenDownloadSelect.bind(this)}>
          <i className="icon__download"></i> Last ned
        </button>
        {isDownloadSelectOpen && this.renderDownloadSelect()}
      </span>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const {region} = ownProps
  const {allRegions} = state
  return {
    region: region,
    allRegions: allRegions
  }
}

export default connect(mapStateToProps)(DownloadWidget)
