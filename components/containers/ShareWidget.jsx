import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PopupShareBox from './PopupShareBox'
import {trackChartLinkOpen} from '../../actions/tracking'


class ShareWidget extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    chartUrl: PropTypes.string
  };

  constructor(props) {
    super()
    this.state = {}
  }

  handleOpenDialog(event) {
    event.preventDefault()
    if (!this.state.isDialogOpen) {
      this.props.dispatch(trackChartLinkOpen())
    }
    this.setState({isDialogOpen: !this.state.isDialogOpen})
  }

  renderDialog() {
    const handleCancelDialog = () => this.setState({isDialogOpen: false})
    return (
      <PopupShareBox
        onCancel={handleCancelDialog}
        chartUrl={this.props.chartUrl}
      />
    )
  }

  render() {
    const {isDialogOpen} = this.state

    return (
      <span className="graph__functions-item">
        <button type="button" className="button button--secondary button--small"
          onClick={this.handleOpenDialog.bind(this)}
        >
          <i className="icon__export"></i> Lenke til figuren
        </button>
        {isDialogOpen && this.renderDialog()}
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

export default connect(mapStateToProps)(ShareWidget)
