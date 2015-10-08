import React, {Component, PropTypes} from 'react'

export default class ToggleButtonList extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    renderButton: PropTypes.func
  }

  static defaultProps = {
    renderButton: button => button
  }

  toggle(option) {
    const {value} = this.props
    if (value.includes(option)) {
      this.deselect(option)
    } else {
      this.select(option)
    }
  }
  select(option) {
    const {onAdd, onChange, value} = this.props
    if (onChange) {
      onChange(value.concat(option))
    }
    if (onAdd) {
      onAdd(option)
    }
  }

  deselect(option) {
    const {onChange, onRemove, value} = this.props
    if (onChange) {
      onChange(value.filter(opt => opt !== option))
    }
    if (onRemove) {
      onRemove(option)
    }
  }

  render() {
    const {value, options, renderButton} = this.props
    return (
      <ul className="t-no-list-styles">
        {options.map((opt, i) => (
          <li className="col--flow">
            <label className="filter-choice">
              <input type="checkbox" name="_filter-place" onChange={() => this.toggle(opt)} checked={value.includes(opt)}/>
              <span className="filter-choice__control">
                <i className="filter-choice__indicator"/>
                {renderButton(opt, i)}
              </span>
            </label>
          </li>
          ))}
      </ul>
    )
  }
}
