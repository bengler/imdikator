import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

// Compares contents of two arrays and returns true if values + indexes match
function valuesEqual(value) {
  if (!Array.isArray(value)) {
    return other => value === other
  }
  return other => {
    if (value.length !== other.length) {
      return false
    }
    return value.every((item, i) => item === other[i])
  }
}

export default class FilterSelect extends Component {
  static propTypes = {
    label: PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.array, PropTypes.string])),
    value: PropTypes.any,
    hidden: PropTypes.bool,
    locked: PropTypes.bool,
    constrained: PropTypes.bool,
    renderChoice: PropTypes.func.isRequired,
    onChange: PropTypes.func
  }
  static defaultProps = {
    choices: [],
    onChange() {},
    renderChoice(choice, i, choices) {}
  }

  constructor(props) {
    super()
    this.state = {
      animateConstrained: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({animateConstrained: !this.props.constrained && nextProps.constrained})
  }

  handleChange(event) {
    const {choices} = this.props
    const value = choices[event.target.value]
    this.props.onChange(value)
  }

  render() {
    const {value, constrained, locked, label, renderChoice, choices} = this.props

    const disabled = locked || choices.length == 1

    const selectContainerClasses = cx({
      select: true,
      'subtle-select__select': true,
      'subtle-select__select--disabled': disabled
    })

    const selectedIndex = choices.findIndex(valuesEqual(value))

    const wrapInConstrained = children => {
      const classes = cx({
        'field-notification': true,
        'field-notification--animate': constrained && this.state.animateConstrained
      })
      return (
        <div className={classes}>
          <p className="field-notification__caption">
            <i className="icon__arrow-right"/>
            Avgrenset
          </p>
          {children}
        </div>
      )
    }

    const filter = (
      <div className="subtle-select">
        <label>
          <span className="subtle-select__label">
            {label}:
          </span>
          <div className={selectContainerClasses}>
            <select
              value={selectedIndex}
              disabled={disabled}
              onChange={this.handleChange.bind(this)}>
              {choices.map((choice, i) => (
                <option key={i} value={i}>
                  {renderChoice(choice, i, choices)}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
    )

    return constrained ? wrapInConstrained(filter) : filter
  }
}
