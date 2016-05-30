import React, {Component, PropTypes} from 'react'
import {_t} from '../../lib/translate'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'
import {capitalize} from 'lodash'

export default class RegionChildrenList extends Component {

  static propTypes = {
    region: ImdiPropTypes.region,
    childRegions: PropTypes.arrayOf(ImdiPropTypes.region),
    createLinkToRegion: PropTypes.func.isRequired
  };

  renderTitle(region) {
    if (region.prefixedCode == 'F00') {
      return 'Fylker i Norge'
    }
    switch (region.type) {
      case 'municipality':
        return `${capitalize(_t('several-borough'))} i ${region.name}`
      case 'county':
        return `${capitalize(_t('several-municipality'))} i ${region.name}`
      case 'commerceRegion':
        return `${capitalize(_t('several-municipality'))} i ${region.name}`
      case 'borough':
        return ''
      default:
        throw new Error(`Unknown region type ${region.type}`)
    }
  }

  render() {
    const {region, childRegions, createLinkToRegion} = this.props

    return (
      <div className="col-block-bleed--full-right">
        <h2 className="feature__section-title">
          {this.renderTitle(region)}
        </h2>
        <nav role="navigation" className="navigation">
          <ul className="t-no-list-styles">
            {childRegions.map(childRegion => {
              return (
                <li key={childRegion.prefixedCode} className="col--third col--flow col--right-padding">
                  <a className="navigation__link" href={createLinkToRegion(childRegion)}>{childRegion.name}</a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    )
  }
}
