import React, {Component, PropTypes} from 'react'

export default class ToggleButtonList extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func,
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
    const {onChange, value} = this.props
    onChange(value.concat(option))
  }

  deselect(option) {
    const {onChange, value} = this.props
    onChange(value.filter(opt => opt !== option))
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
