import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import smoothScroll from 'smoothscroll'

import {getHeaderKey, getPageTitle, getPageIngress} from '../../lib/regionUtil'
import CardPageButtonsContainer from '../containers/CardPageButtonsContainer'
import CardList from '../containers/CardList'
import RegionSearch from '../containers/RegionSearchContainer'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'
import RegionInfoContainer from '../containers/RegionInfoContainer'
import {_t} from '../../lib/translate'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'


class CardsPage extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    noValues: PropTypes.bool,
    dispatch: PropTypes.func,
    cards: PropTypes.arrayOf(ImdiPropTypes.card),
    cardsPage: ImdiPropTypes.cardsPage,
    openCards: PropTypes.arrayOf(PropTypes.string),
    region: ImdiPropTypes.region,
  };

  static contextTypes = {
    goTo: PropTypes.func,
  };

  handleSwitchRegion(region) {
    smoothScroll(this.pageSection)
    this.context.goTo('/tall-og-statistikk/steder/:region', {region: region.prefixedCode})
  }

  renderCardList() {
    const {region, openCards, cards, cardsPage, noValues} = this.props

    if (noValues) {
      return (
        <div className="page__content page__content--section">
          <p className="t-margin-bottom--xlarge">
            Det finnes ikke noe data for denne visningen. Det kan være at de er skjult av
            personvernhensyn eller ikke tilgjengelig for denne regionen.
          </p>
        </div>
      )
    }

    return <CardList region={region} cardsPage={cardsPage} openCards={openCards} cards={cards} />
  }

  render() {
    const {cardsPage, region} = this.props

    if (!cardsPage || !region) {
      return <div className="page__content page__content--section"><i className="loading-indicator" /> Laster...</div>
    }

    return (
      <div>
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header id="page-header" className="t-no-focus" tabIndex="-1">
                  <h1>{getPageTitle(region)}</h1>
                  <p className="ingress">{getPageIngress(region)}</p>
                  <div className="t-margin-bottom--large t-hide-on-print">
                    <label><span className="label">Gå til sted</span>
                      <div className="search search--autocomplete">
                        <RegionSearch onSelect={this.handleSwitchRegion.bind(this)} placeholder="Kommune/bydel/fylke/næringsregion" />
                      </div>
                    </label>
                  </div>
                </header>
              </div>
            </div>
          </div>
        </div>

        <div className="page__section page__section--grey" ref={(pageSection) => { this.pageSection = pageSection }}>
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <CardPageButtonsContainer />
                <h2 className="feature__section-title">{cardsPage.title} i {region.name}</h2>
                {this.renderCardList()}
              </div>
            </div>
          </div>
        </div>
        <div className="page__footer">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <div className="feature feature--white">
                  <h2 className="feature__title">{region.name} {_t(region.type)}</h2>
                  <RegionInfoContainer region={region} />
                  <RegionQuickSwitch />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {

  const currentRegion = state.currentRegion

  if (!state.currentCardsPage) {
    return {}
  }

  function cardHasValues(card) {
    const regionHeaderKey = getHeaderKey(currentRegion)
    const tableName = card.query.tableName

    if (!(tableName in state.headerGroups)) {
      // Header groups have not arrived for this table yet
      return false
    }

    const headerGroups = state.headerGroups[tableName]

    return headerGroups.some(group => {
      return group[regionHeaderKey] && group[regionHeaderKey].includes(currentRegion.code)
    })
  }

  const someGotValues = state.currentCardsPage.cards.some(cardHasValues)

  return {
    cards: state.currentCardsPage.cards.map(card => {
      return Object.assign({}, card, {
        noValues: !cardHasValues(card)
      })
    }),
    noValues: !someGotValues,
    cardsPage: state.currentCardsPage,
    region: state.currentRegion,
    openCards: state.openCards
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardsPage)
