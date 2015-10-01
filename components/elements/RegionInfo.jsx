import React, {Component, PropTypes} from 'react'
import {prefixify, regionByCode} from '../../lib/regionUtil'
import {_t} from '../../lib/translate'


function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default class RegionInfo extends Component {

  static propTypes = {
    region: PropTypes.object,
    allRegions: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func
  }

  render() {
    const region = this.props.region
    const allRegions = this.props.allRegions
    const municipality = region.municipalityCode ? regionByCode(region.municipalityCode, 'municipality', allRegions) : null
    const county = region.countyCode ? regionByCode(region.countyCode, 'county', allRegions) : null
    const commerceRegionCode = region.commerceRegionCode || (municipality ? municipality.commerceRegionCode : null)
    const commerceRegion = commerceRegionCode ? regionByCode(commerceRegionCode, 'commerceRegion', allRegions) : null

    return (
      <div>
        <p>
          <span>Dette er tall og statistikk fra <a href="#oppsummert">{region.name}</a>. </span>
          {region.type == 'borough'
            && <span>{capitalize(_t('the-' + region.type))} ligger i <a href={this.context.linkTo('/steder/:region', {region: prefixify(municipality)})}>{municipality.name}</a> kommune og er en del av <a href={this.context.linkTo('/steder/:region', {region: prefixify(commerceRegion)})}>{commerceRegion.name}</a>.</span>
          }

          {region.type == 'municipality'
            && county
            && <span>{capitalize(_t('the-' + region.type))} ligger i <a href={this.context.linkTo('/steder/:region', {region: prefixify(county)})}>{county.name}</a> fylke og er en del av <a href={this.context.linkTo('/steder/:region', {region: prefixify(commerceRegion)})}>{commerceRegion.name}</a>.</span>
          }

          <span> Se <a href="">andre {_t('several-' + region.type)} som ligner på {region.name}</a> <code>[TODO]</code> når det kommer til folketall, innvandrerandel og flyktningsandel.</span>
        </p>
      </div>
    )
  }
}
