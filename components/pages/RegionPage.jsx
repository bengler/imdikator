import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import RegionSummaryChartsContainer from '../containers/RegionSummaryChartsContainer'
import RegionChildListContainer from '../containers/RegionChildListContainer'
import CardPageButtonsContainer from '../containers/CardPageButtonsContainer'
import RegionInfoContainer from '../containers/RegionInfoContainer'
import RegionSearch from '../containers/RegionSearchContainer'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'

import {getPageTitle, getPageIngress} from '../../lib/regionUtil'
import {_t} from '../../lib/translate'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class RegionPage extends Component {

  static propTypes = {
    currentRegion: ImdiPropTypes.region,
    comparableRegions: PropTypes.arrayOf(ImdiPropTypes.region)
  };

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  };

  handleSelectRegion(region) {
    this.context.goTo('/tall-og-statistikk/steder/:region', {region: region.prefixedCode})
  }

  render() {
    const {currentRegion} = this.props

    if (!currentRegion) {
      return null
    }

    const factSheetLink = this.context.linkTo('/tall-og-statistikk/steder/:region/fakta', {region: currentRegion.prefixedCode})

    return (
      <main className="page">
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header id="page-header" className="t-no-focus" tabindex="-1">
                  <h1>{getPageTitle(currentRegion)}</h1>
                  <p className="ingress">{getPageIngress(currentRegion)}</p>
                  <div className="t-margin-bottom--large t-hide-on-print">
                    <label><span className="label">Gå til sted</span>
                      <div className="search search--autocomplete">
                          <RegionSearch onSelect={this.handleSelectRegion.bind(this)} placeholder="Kommune/bydel/fylke/næringsregion" />
                      </div>
                    </label>
                  </div>
                </header>
              </div>
            </div>
          </div>
        </div>
        <div className="page__section page__section--grey">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <CardPageButtonsContainer />
                <h2 className="page__section-title">Oppsummering</h2>
                <div className="col-block-bleed--full-right col-block-bleed--inline-mobile">
                  <div className="row">
                    <RegionSummaryChartsContainer region={currentRegion}/>
                  </div>
                </div>

                <div className="feature t-hide-on-print">
                  <h2 className="feature__title">Faktaark</h2>
                  <p>
                    Et dokument hvor alle nøkkeltallene fra {currentRegion.name}
                    {currentRegion.name != 'Norge' ? _t(currentRegion.type) : ''} er gjengitt.
                  </p>
                  <p>
                    <a href={factSheetLink} className="button button-">
                      <i className="icon__download icon--white"/> Utskriftsvennlig faktaark
                    </a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="page__footer">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <div className="feature feature--white">
                  <h2 className="feature__title">{currentRegion.name}</h2>
                  <RegionInfoContainer region={currentRegion}/>
                  <RegionQuickSwitch/>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          <div className="page__footer t-hide-on-print">
            <div className="wrapper">
              <div className="row">
                <div className="col--main">
                  <div className="feature feature--white">
                    <RegionChildListContainer region={currentRegion}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentRegion: state.currentRegion
  }
}

export default connect(mapStateToProps)(RegionPage)
