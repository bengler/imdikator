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
  handleCancelRegionFilter() {
    this.setState({open: false})
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
        {open && <RegionSelect
          options={options}
          value={value}
          onCancel={this.handleCancelRegionFilter.bind(this)}
          onApply={this.handleApplyRegionFilter.bind(this)}
          similarRegions={similarRegions}
          />
        }
        {!open && (
          <div>
            <h2>Valg:</h2>
            <button className="button button--primary" onClick={() => this.setState({open: true})}>Endre…</button>
            <pre style={{fontSize: '80%'}}>{JSON.stringify(value, null, 2)}</pre>
          </div>
        )}
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