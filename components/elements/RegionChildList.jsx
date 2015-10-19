import React, {Component, PropTypes} from 'react'
import {_t} from '../../lib/translate'
import {childRegionsByParent, allCounties} from '../../lib/regionUtil'


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
    let childTitle
    if (region.type == 'municipality') {
      childRegions = childRegionsByParent('borough', region, allRegions)
      childTitle = `${capitalize(_t('several-borough'))} i ${region.name}`
    }
    if (region.type == 'county') {
      childRegions = childRegionsByParent('municipality', region, allRegions)
      childTitle = `${capitalize(_t('several-municipality'))} i ${region.name}`
    }
    if (region.type == 'commerceRegion') {
      childRegions = childRegionsByParent('municipality', region, allRegions)
      childTitle = `${capitalize(_t('several-municipality'))} i ${region.name}`
    }
    if (region.prefixedCode == 'F00') {
      childRegions = allCounties(allRegions)
      childTitle = 'Fylker i Norge'
    }
    return (
      <div className="col-block-bleed--full-right">
        <h2 className="feature__section-title">{childTitle}</h2>
        <nav role="navigation" className="navigation">
          <ul className="t-no-list-styles">
            {childRegions.map(childRegion => {
              return (
              <li key={childRegion.code} className="col--third col--flow col--right-padding">
                <a className="navigation__link" href={this.context.linkTo('/steder/:region', {region: childRegion.prefixedCode})}>{childRegion.name}</a>
              </li>
              )
            })}
          </ul>
        </nav>
      </div>
    )
  }
}
