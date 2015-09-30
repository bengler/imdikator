import React, {Component, PropTypes} from 'react'
import RegionSelect from '../elements/filter/RegionSelect'
import {connect} from 'react-redux'

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
      similar: allRegions.slice(0, 5),
      average: allRegions.slice(0, 5)
    }

    return (
      <div>
        {!open && <button onClick={() => this.setState({open: true})}>Velg…</button>}
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
