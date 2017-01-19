import React, {Component, PropTypes} from 'react'
import {StickyContainer, Sticky} from 'react-sticky'
import CardList from '../containers/CardList'
import {connect} from 'react-redux'
import {getHeaderKey, getPageTitle, getPageIngress} from '../../lib/regionUtil'
import CardPageButtonsContainer from '../containers/CardPageButtonsContainer'
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
    linkTo: PropTypes.func,
  };

  handleSwitchRegion(region) {
    const {cardsPage} = this.props
    const firstCard = cardsPage.cards[0]
    this.context.goTo('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName', {
      region: region.prefixedCode,
      cardsPageName: cardsPage.name,
      cardName: firstCard.name
    })
  }

  createLinkToRegion(region) {
    return this.context.linkTo('/tall-og-statistikk/steder/:region', {region: region.prefixedCode})
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
              <div className="col--main">
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
        <style dangerouslySetInnerHTML={{__html: `
          .sticky-header {
            display: none;
            background: #f2efed;
            background-image: linear-gradient(0deg,transparent 0px,#f2efed 10px);
            //background: white;
            border-bottom: 3px solid white;
            z-index: 3;
            padding: 1rem 0;
            padding-bottom: 0;
          }
          .sticky-header__head {
            display: block;
            width: 50%;
            float: left;
            padding-right: 1rem;
            padding-bottom: 0.5rem;
          }
          .sticky-header__title {
            font-size: 24px;
            font-size: 1rem;
            font-weight: normal;
            font-style: normal;
            margin-top: 0px;
            font-family: "Siri Medium",Tahoma,sans-serif;
            font-weight: normal;
            font-style: normal;
            font-size: 16px;
            font-size: .8888888888888888rem;
            line-height: 1.75;
            margin-bottom: 0;
            text-transform: uppercase;
            letter-spacing: .05em;
          }
          .sticky-header__title a {
            color: black;
          }
          .sticky-header__subtitle {
            font-size: 0.833rem;
            font-family: "Siri",Tahoma,sans-serif;
            display: block;
          }
          .sticky-header__search {
            position: relative;
            display: block;
            width: 50%;
            float: right;
            margin: 0;
            padding-right: 1em;
          }
          .sticky-header__search-icon {
            display: none;
            position: absolute;
            margin-left: 0.5rem;
            margin-top: 0.25rem;
          }
          .sticky-header__search .search {
            max-width: none;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          .sticky-header--fixed {
            display: block;
            animation: fadeIn 200ms ease both;
          }

          @media (max-width: 45em) {
            .sticky-header {
              padding-top: 0.5rem;
            }
            .sticky-header__search {
              display: none;
            }
            .sticky-header__head {
              width: 100%;
              padding-bottom: 0.5rem;
              padding-right: 1rem;
            }
            .sticky-header__subtitle {
              display: none;
            }
            .sticky-header__search-icon {
              display: inline-block;
            }
          }
        `}} />
        <StickyContainer>
          <Sticky className="sticky-header" stickyClassName={'sticky-header--fixed'} topOffset={230}>
            <div className="wrapper">
              <div className="row">
                <div className="col--main-wide">
                  <div className="sticky-header__head">
                    <div className="sticky-header__title">{cardsPage.title} i <a href={this.createLinkToRegion(region)}>{region.name}
                      <i className="icon__search icon--red sticky-header__search-icon"></i></a></div>
                    <div className="sticky-header__subtitle">Tall og statistikk fra IMDi</div>
                  </div>
                  <label className="sticky-header__search">
                    <span className="label t-only-screenreaders">Gå til sted</span>
                    <div className="search search--autocomplete">
                      <RegionSearch onSelect={this.handleSwitchRegion.bind(this)} placeholder="Kommune/bydel/fylke/næringsregion" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Sticky>
          <div className="page__section page__section--grey">
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
        </StickyContainer>
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
