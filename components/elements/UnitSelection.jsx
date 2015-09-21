import React, {Component, PropTypes} from 'react'

export default class UnitSelection extends Component {
  static propTypes = {
    units: PropTypes.array,
    selectedUnit: PropTypes.string,
    onChangeUnit: PropTypes.function
  }

  render() {
    const change = event => {
      this.props.selectedUnit = event.target.value
      this.props.onChangeUnit(this.props.selectedUnit)
    }

    const options = this.props.units.map(unit => {
      return (
        <option value={unit}>{unit}</option>
      )
    })

    return (
        <select onChange={change} className="units" value={this.props.selectedUnit}>
        {options}
        </select>
    )
  }
}
