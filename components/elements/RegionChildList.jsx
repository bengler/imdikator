import React, {Component, PropTypes} from 'react'
import {_t} from '../../lib/translate'
import {prefixifyRegion, regionsByParent} from '../../lib/regionUtil'


function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default class RegionChildrenList extends Component {

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
    let childRegions = []
    let childRegionType
    if (region.type == 'municipality') {
      childRegions = regionsByParent('municipalityCode', region.code, allRegions)
      childRegionType = capitalize(_t('several-borough'))
    }
    if (region.type == 'county') {
      childRegions = regionsByParent('countyCode', region.code, allRegions)
      childRegionType = capitalize(_t('several-municipality'))
    }
    if (region.type == 'commerceRegion') {
      childRegions = regionsByParent('commerceRegionCode', region.code, allRegions)
      childRegionType = capitalize(_t('several-municipality'))
    }

    if (childRegions.length < 2) {
      // never mind rendering a single result in the list, it just looks sad
      return null
    }
    return (
      <div className="col-block-bleed--full-right">
        <h2 className="feature__section-title">{childRegionType} i {region.name}</h2>
        <nav role="navigation" className="navigation">
          <ul className="t-no-list-styles">
            {childRegions.map(childRegion => {
              return (
              <li key={childRegion.code} className="col--third col--flow col--right-padding">
                <a className="navigation__link" href={this.context.linkTo('/steder/:region', {region: prefixifyRegion(childRegion)})}>{childRegion.name}</a>
              </li>
              )
            })}
          </ul>
        </nav>
      </div>
    )
  }
}
