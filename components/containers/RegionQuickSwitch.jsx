import React, {Component, PropTypes} from 'react'
import {prefixifyRegion} from '../../lib/regionUtil'
import RegionSearch from './RegionSearchContainer'

export default class RegionQuickSwitch extends Component {
  static contextTypes = {
    goTo: PropTypes.func
  };

  handleSelectRegion(region) {
    this.context.goTo('/tall-og-statistikk/steder/:region', {region: prefixifyRegion(region)})
  }

  render() {
    return (
      <div className="t-hide-on-print">
        <label>
          <span className="label h3 t-margin-top--large">Gå til sted</span>
          <div className="search search--autocomplete">
              <RegionSearch onSelect={this.handleSelectRegion.bind(this)} placeholder="Kommune/bydel/fylke/næringsregion"/>
          </div>
        </label>
        <p>Du kan finne tall for alle kommuner, fylker, bydeler og næringsregioner i Norge.</p>
      </div>
    )
  }
}
