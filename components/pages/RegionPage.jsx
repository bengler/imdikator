import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import RegionSummaryChartsContainer from '../containers/RegionSummaryChartsContainer'
import RegionChildListContainer from '../containers/RegionChildListContainer'
import CardPageButtonsContainer from '../containers/CardPageButtonsContainer'
import RegionInfoContainer from '../containers/RegionInfoContainer'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'
import {_t} from '../../lib/translate'

import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class RegionPage extends Component {

  static propTypes = {
    currentRegion: ImdiPropTypes.region,
    comparableRegions: PropTypes.arrayOf(ImdiPropTypes.region)
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  handleSelectRegion(region) {
    this.context.goTo('/steder/:region', {region: region.prefixedCode})
  }

  render() {
    const {currentRegion} = this.props

    if (!currentRegion) {
      return null
    }

    const factSheetLink = this.context.linkTo('/steder/:region/fakta', {region: currentRegion.prefixedCode})

    return (
      <main className="page">
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header>
                  <h1>{currentRegion.name} {_t(currentRegion.type)}</h1>
                  <p className="ingress">Tall og statistikk om integrering i {_t(`the-${currentRegion.type}`)}</p>
                </header>
              </div>
            </div>
          </div>
        </div>
        <section className="page__section page__section--grey">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <CardPageButtonsContainer />
                <h2 className="t-only-screenreaders">Oppsummering</h2>
                <div className="col-block-bleed--full-right col-block-bleed--inline-mobile">
                  <div className="row">
                    <RegionSummaryChartsContainer region={currentRegion}/>
                  </div>
                </div>

                <section className="feature">
                  <h2 className="feature__title">Faktaark</h2>
                  <p>
                    Et dokument hvor alle nøkkeltallene fra {currentRegion.name} {_t(currentRegion.type)} er gjengitt.
                  </p>
                  <p>
                    <a href={factSheetLink} className="button button-">
                      <i className="icon__download icon--white"/>
                      Utskriftsvennlig faktaark
                    </a>
                  </p>
                </section>

              </div>
            </div>
          </div>
        </section>

        <div className="page__footer">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <section className="feature feature--white">
                  <h2 className="feature__title">{currentRegion.name}</h2>
                  <RegionInfoContainer region={currentRegion}/>
                  <RegionQuickSwitch/>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className="page__footer">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <section className="feature feature--white">
                  <RegionChildListContainer region={currentRegion}/>
                </section>
              </div>
            </div>
          </div>
        </div>
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
