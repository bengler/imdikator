import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {prefixifyRegion} from '../../lib/regionUtil'
import RegionSearch from './RegionSearch'

class RegionQuickSwitch extends Component {
  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  handleSelectRegion(region) {
    this.context.goTo('/steder/:region', {region: prefixifyRegion(region)})
  }

  render() {
    return (
      <div className="search search--autocomplete">
        <label className="t-margin-top--large">Gå til sted
          <RegionSearch onSelect={this.handleSelectRegion.bind(this)}/>
        </label>
      </div>
    )
  }
}


// Wrap the component to inject dispatch and state into it
export default connect()(RegionQuickSwitch)
