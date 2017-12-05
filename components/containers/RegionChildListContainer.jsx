import React, {Component, PropTypes} from 'react'
import {childRegionsByParent, allCounties} from '../../lib/regionUtil'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import RegionChildList from '../elements/RegionChildList'
import {connect} from 'react-redux'

class RegionChildListContainer extends Component {

  static propTypes = {
    region: ImdiPropTypes.region,
    childRegions: PropTypes.arrayOf(ImdiPropTypes.region)
  };

  static contextTypes = {
    linkTo: PropTypes.func
  };

  render() {
    const {region, childRegions} = this.props
    const {linkTo} = this.context

    const createLinkToRegion = reg => linkTo('/tall-og-statistikk/steder/:region', {region: reg.prefixedCode})

    if (childRegions.length == 0) {
      return null
    }
    return <RegionChildList region={region} childRegions={childRegions} createLinkToRegion={createLinkToRegion} />
  }
}

const childTypes = {
  municipality: 'borough',
  county: 'municipality',
  commerceRegion: 'municipality'
}

function mapStateToProps(state, ownProps) {

  const {allRegions} = state
  const {region} = ownProps

  const isTheWholeOfNorway = region.prefixedCode == 'F00'

  let childRegions

  if (isTheWholeOfNorway) {
    childRegions = allCounties(allRegions)
  }

  else {
    childRegions = childRegionsByParent(childTypes[region.type], region, allRegions)
  }

  return {
    region,
    childRegions
  }
}

export default connect(mapStateToProps)(RegionChildListContainer)
