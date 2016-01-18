import React, {Component, PropTypes} from 'react'
import RegionPicker from './RegionPicker'
import Lightbox from '../Lightbox'
import cx from 'classnames'
import * as ImdiPropTypes from '../../proptypes/ImdiPropTypes'

export default class RegionFilterSelect extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(ImdiPropTypes.region),
    groups: PropTypes.arrayOf(ImdiPropTypes.regionPickerGroup),
    choices: PropTypes.arrayOf(ImdiPropTypes.region),
    locked: PropTypes.bool,
    renderChoice: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    value: [],
    choices: [],
    groups: [],
    onChange() {}
  }

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
    }

    const buttonClasses = cx({
      'subtle-select__button': true,
      'subtle-select__button--expanded': value.length > 0,
      'subtle-select__button--add': value.length > 0
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
    this.setRegionPickerOpen(!this.state.isRegionPickerOpen)
  }

  renderRegionPickerLightbox() {
    const {value, choices, groups, renderChoice, onChange} = this.props

    const handleApplyRegionFilter = newValue => {
      onChange(newValue)
      this.closeRegionPickerLightBox()
    }

    const handleCancelRegionFilter = () => this.closeRegionPickerLightBox()

    return (
      <Lightbox title="Legg til sammenlikning" onClose={handleCancelRegionFilter} onClickOutside={handleCancelRegionFilter}>
        <RegionPicker
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
