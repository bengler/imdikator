import React, {Component, PropTypes} from 'react'

export default class UnitSelection extends Component {
  static propTypes = {
    units: PropTypes.array,
    onSelectUnit: PropTypes.function
  }

  render() {
    const options = this.props.units.map(unit => {
      return (
        <option value={unit}>{unit}</option>
      )
    })

    return (
        <select className="units">
        {options}
        </select>
    )
  }
}
