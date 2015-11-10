import React, {Component, PropTypes} from 'react'
import RegionInfo from '../elements/RegionInfo'
import {connect} from 'react-redux'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class RegionInfoContainer extends Component {

  static propTypes = {
    region: ImdiPropTypes.region.isRequired,
    municipality: ImdiPropTypes.region,
    county: ImdiPropTypes.region,
    commerceRegion: ImdiPropTypes.region
  }

  static contextTypes = {
    linkTo: PropTypes.func
  }

  createLinkToRegion(region) {
    return this.context.linkTo('/indikator/steder/:region', {region: region.prefixedCode})
  }

  createLinkToSimilarRegion(region) {
    return this.context.linkTo('/indikator/steder/:region/lignende', {region: region.prefixedCode})
  }

  render() {
    const {region, municipality, county, commerceRegion} = this.props
    return (
      <RegionInfo
        region={region}
        municipality={municipality}
        county={county}
        commerceRegion={commerceRegion}
        createLinkToRegion={this.createLinkToRegion.bind(this)}
        createLinkToSimilarRegion={this.createLinkToSimilarRegion.bind(this)}
      />
    )
  }
}

function mapStateToProps(state, ownProps) {

  const {region} = ownProps

  const {allRegions} = state

  const findMunicipalityCode = region.municipalityCode
  const findCountyCode = region.countyCode

  let municipality = null
  let county = null

  // This is an optimization to avoid iteration over allRegions too many times times
  allRegions.some(reg => {
    if (reg.type == 'municipality' && reg.code == findMunicipalityCode) {
      municipality = reg
    }
    if (reg.type == 'county' && reg.code == findCountyCode) {
      county = reg
    }
    // Should stop if we found what we looked for
    return (!findMunicipalityCode || municipality) && (!findCountyCode || county)
  })

  // Unfortunately we cannot do this before we already found the municipality
  const findCommerceRegionCode = region.commerceRegionCode || municipality && municipality.commerceRegionCode
  const commerceRegion = findCommerceRegionCode && allRegions.find(reg => {
    return reg.type == 'commerceRegion' && reg.code == findCommerceRegionCode
  })

  return {
    municipality,
    county,
    commerceRegion
  }
}

export default connect(mapStateToProps)(RegionInfoContainer)
