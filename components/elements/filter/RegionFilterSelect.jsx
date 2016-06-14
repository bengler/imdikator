import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RegionPicker from './RegionPicker'
import Lightbox from '../Lightbox'
import cx from 'classnames'
import {trackRegionCompareOpen, trackRegionCompareCount} from '../../../actions/tracking'
import * as ImdiPropTypes from '../../proptypes/ImdiPropTypes'

class RegionFilterSelect extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    value: PropTypes.arrayOf(ImdiPropTypes.region),
    groups: PropTypes.arrayOf(ImdiPropTypes.regionPickerGroup),
    choices: PropTypes.arrayOf(ImdiPropTypes.region),
    locked: PropTypes.bool,
    renderChoice: PropTypes.func,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: [],
    choices: [],
    groups: [],
    onChange() {}
  };

  constructor(props) {
    super()
    this.state = {
      isRegionPickerOpen: false
    }
  }

  renderFilterButton() {
    const {value, locked, choices, renderChoice} = this.props
    const hasValue = value.length > 0
    const disabled = locked || choices.length == 1

    function getButtonText() {
      if (hasValue) {
        return renderChoice(value)
      }
      if (!locked) {
        return 'Legg til sted'
      }
      return null
    }

    const buttonClasses = cx({
      'subtle-select__button': true,
      'subtle-select__button--add': true,
      'subtle-select__button--expanded': this.state.isRegionPickerOpen
    })

    return (
      <button
        type="button"
        disabled={disabled}
        className={buttonClasses}
        onClick={this.toggleRegionPickerLightBox.bind(this)}
      >
        {getButtonText()}
      </button>
    )
  }

  setRegionPickerOpen(bool) {
    this.setState({isRegionPickerOpen: bool})
  }
  openRegionPickerLightBox() {
    this.setRegionPickerOpen(true)
  }
  closeRegionPickerLightBox() {
    this.setRegionPickerOpen(false)
  }

  toggleRegionPickerLightBox() {
    if (!this.state.isRegionPickerOpen) {
      this.props.dispatch(trackRegionCompareOpen())
    }
    this.setRegionPickerOpen(!this.state.isRegionPickerOpen)
  }

  renderRegionPickerLightbox() {
    const {value, choices, groups, renderChoice, onChange, dispatch} = this.props

    const handleApplyRegionFilter = newValue => {
      onChange(newValue)
      this.closeRegionPickerLightBox()
      const countOfRegions = newValue.length
      if (countOfRegions > 0) {
        this.props.dispatch(trackRegionCompareCount(countOfRegions))
      }
    }

    const handleCancelRegionFilter = () => this.closeRegionPickerLightBox()

    return (
      <Lightbox title="Sammenliknet med" onClose={handleCancelRegionFilter} onClickOutside={handleCancelRegionFilter}>
        <RegionPicker
          dispatch={dispatch}
          onCancel={handleCancelRegionFilter}
          onApply={handleApplyRegionFilter}
          groups={groups}
          renderChoice={renderChoice}
          choices={choices}
          value={value}
        />
      </Lightbox>
    )
  }

  render() {
    const {isRegionPickerOpen, locked} = this.state

    const classes = cx({
      'subtle-select': true,
      'subtle-select__select--disabled': locked
    })


    return (
      <div>
        <div className={classes}>
          <label>
            <span className="subtle-select__label">
            Sammenliknet med:
            </span>
            {this.renderFilterButton()}
          </label>
        </div>
        {isRegionPickerOpen && this.renderRegionPickerLightbox()}
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(RegionFilterSelect)
