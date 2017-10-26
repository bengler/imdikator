import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import smoothScroll from 'smoothscroll'

import RegionSummaryChartsContainer from '../containers/RegionSummaryChartsContainer'
import RegionChildListContainer from '../containers/RegionChildListContainer'
import CardPageButtonsContainer from '../containers/CardPageButtonsContainer'
import RegionInfoContainer from '../containers/RegionInfoContainer'
import RegionSearch from '../containers/RegionSearchContainer'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'
import {showOverlay} from '../../actions/overlay'

import {getPageTitle, getPageIngress} from '../../lib/regionUtil'
import {_t} from '../../lib/translate'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class RegionPage extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    currentRegion: ImdiPropTypes.region,
    comparableRegions: PropTypes.arrayOf(ImdiPropTypes.region)
  };

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  constructor() {
    super()
    this.handleSelectRegion = this.handleSelectRegion.bind(this)
    this.handleClickFactSheet = this.handleClickFactSheet.bind(this)
  }

  handleClickFactSheet() {
    // Show full-page loading overlay
    this.props.dispatch(showOverlay())
    this.context.goTo('/tall-og-statistikk/steder/:region/fakta', {region: this.props.currentRegion.prefixedCode})
  }

  handleSelectRegion(region) {
    this.gotoElement(this.pageSection)
    this.context.goTo('/tall-og-statistikk/steder/:region', {region: region.prefixedCode})
  }

  scrollToTop() {
    smoothScroll(document.querySelector('body'))
  }

  gotoElement(element) {
    smoothScroll(element)
  }

  regionName() {
    const {name, type} = this.props.currentRegion
    const typeOfPlace = _t(type)

    const isNorge = (name === 'Hele landet')

    if (isNorge) {
      return 'Norge'
    }

    return `${name} ${typeOfPlace}`
  }

  render() {
    const {currentRegion} = this.props

    if (!currentRegion) {
      return null
    }

    return (
      <main className="page">
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header id="page-header" className="t-no-focus" tabIndex="-1">
                  <h1>{getPageTitle(currentRegion)}</h1>
                  <p className="ingress">{getPageIngress(currentRegion)}</p>
                  <div className="t-margin-bottom--large t-hide-on-print">
                    <label><span className="label">Gå til sted</span>
                      <div className="search search--autocomplete">
                        <RegionSearch onSelect={this.handleSelectRegion} placeholder="Kommune/bydel/fylke/næringsregion" />
                      </div>
                    </label>
                  </div>
                </header>
              </div>
            </div>
          </div>
        </div>
        <div id="pageSection" ref={(pageSection) => { this.pageSection = pageSection }} className="page__section page__section--grey">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <CardPageButtonsContainer />

                <h2 className="page__section-title">
                  Oppsummering av {currentRegion.name && this.regionName()}
                </h2>

                <div className="col-block-bleed--full-right col-block-bleed--inline-mobile">
                  <div className="row">
                    <RegionSummaryChartsContainer region={currentRegion} />
                  </div>
                </div>

                <div className="feature t-hide-on-print">
                  <h2 className="feature__title">Faktaark</h2>

                  <p>
                    Et dokument hvor alle nøkkeltallene fra {currentRegion.name}
                    {currentRegion.name == 'Norge' ? '' : ` ${_t(currentRegion.type)}`} er gjengitt.
                  </p>

                  <p>
                    <a href="#" onClick={this.handleClickFactSheet} className="button button-">
                      <i className="icon__download icon--white" /> Utskriftsvennlig faktaark
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
                  <RegionInfoContainer region={currentRegion} />
                  <RegionQuickSwitch />
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
                    <RegionChildListContainer region={currentRegion} />
                  </div>
                  <button className="button scroll-to-top" onClick={() => this.scrollToTop()}>
                    Gå til toppen!
                  </button>
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
