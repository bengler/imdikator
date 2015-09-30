import React, {Component, PropTypes} from 'react'
import RegionSelect from '../elements/filter/RegionSelect'
import {connect} from 'react-redux'
// Todo: remove eventually
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

class TestRegionSelect extends Component {
  static propTypes = {
    route: PropTypes.object,
    allRegions: PropTypes.array
  }

  constructor() {
    super()
    this.state = {
      open: true,
      value: null
    }
  }
  handleApplyRegionFilter(newValue) {
    this.setState({value: newValue, open: false})
  }
  render() {
    const {allRegions} = this.props
    if (!allRegions) {
      return null
    }

    const {similarRegions, open, value} = this.state

    const options = {
      similar: shuffle(allRegions.slice()).slice(0, 10),
      average: shuffle(allRegions.slice()).slice(0, 10)
    }

    const button = open && <button onClick={() => this.setState({open: true})}>Velg…</button>

    return (
      <div>
        {button}
        {open && <RegionSelect
          options={options}
          value={value}
          onApply={this.handleApplyRegionFilter.bind(this)}
          similarRegions={similarRegions}
          />
        }
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    allRegions: state.allRegions
  }
}

export default connect(mapStateToProps)(TestRegionSelect)
