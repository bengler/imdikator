import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PopupShareBox from './PopupShareBox'


class ShareWidget extends Component {
  static propTypes = {
    chartUrl: PropTypes.string
  }

  constructor(props) {
    super()
    this.state = {}
  }

  handleOpenDialog(event) {
    event.preventDefault()
    this.setState({isDialogOpen: !this.state.isDialogOpen})
  }

  renderDialog() {
    const handleCancelDialog = () => this.setState({isDialogOpen: false})
    return (
      <PopupShareBox
        onCancel={handleCancelDialog}
        title="Lenke til figuren"
        inputLabel="Lenke til figuren"
        applyButtonText="Kopier"
        chartUrl={this.props.chartUrl}
        description="Lenken vil vise til valgt figur med den samme filtreringen som nå er valgt."
      />
    )
  }

  render() {
    const {isDialogOpen} = this.state

    return (
      <span className="graph__functions-item">
        <button type="button" className="button button--secondary button--small"
          onClick={this.handleOpenDialog.bind(this)}>
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
