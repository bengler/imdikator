import React, {Component, PropTypes} from 'react'
import Card from '../containers/Card'
import {connect} from 'react-redux'
import {getHeaderKey} from '../../lib/regionUtil'
import {openCard, closeCard} from '../../actions/cards'
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
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  handleSelectRegion(region) {
    this.context.goTo('/steder/:region', {region: region.prefixedCode})
  }

  renderToggleCardLink(card) {
    const {openCards} = this.props

    const isOpen = openCards.includes(card.name)
    const prevCard = openCards[openCards.length - 2]

    const handleClick = event => {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      if (isOpen) {
        this.context.goTo('/steder/:region/:cardsPageName/:cardName', {cardName: prevCard})
        this.props.dispatch(closeCard(card.name))
      } else {
        this.context.goTo('/steder/:region/:cardsPageName/:cardName', {cardName: card.name})
        this.props.dispatch(openCard(card.name))
      }
    }
    return (
      <a href={this.context.linkTo('/steder/:region/:cardsPageName/:cardName', {cardName: card.name})}
        onClick={handleClick}
        className={`toggle-list__button ${isOpen ? 'toggle-list__button--expanded' : ''}`}
        aria-expanded="true"
        aria-controls="befolkning"
        role="button">
        <h3 className="toggle-list__button-title">{card.title}
          <i className="icon__arrow-down toggle-list__button-icon"/>
        </h3>
      </a>
    )
  }

  renderCards() {
    const {region, openCards, cards, cardsPage, noValues} = this.props

    if (noValues) {
      return (
        <div className="page__content page__content--section">
          Ingenting å vise her…
        </div>
      )
    }

    return (
      <ul className="t-no-list-styles">
      {cards.map(card => {
        const isOpen = openCards.includes(card.name)
        return (
          <li key={card.name}>
            <section className="toggle-list">
              {this.renderToggleCardLink(card)}
              {isOpen && !card.noValues && <Card region={region} card={card} cardsPageName={cardsPage.name}/>}
              {isOpen && card.noValues && <div>Ingen data å vise her</div>}
            </section>
          </li>
          )
      })}
    </ul>
  )
  }
  render() {
    const {cardsPage, region} = this.props

    if (!cardsPage || !region) {
      return <div className="page__content page__content--section"><i className="loading-indicator"/> Laster...</div>
    }

    return (
      <div>
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header>
                  <h1>Integreringen i {region.name} {_t(region.type)}</h1>
                  <p className="ingress">Tall og statistikk over integreringen i {_t('the-' + region.type)}</p>
                  <div className="t-margin-bottom--large">
                    <label htmlFor="compare-search" className="">Gå til sted</label>
                    <div className="search search--autocomplete">
                        <RegionSearch onSelect={this.handleSelectRegion.bind(this)} placeholder="Kommune/bydel/fylke/næringsregion" />
                    </div>
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
                <h2 className="feature__section-title">{cardsPage.title} i {region.name}</h2>
                {this.renderCards()}
              </div>
            </div>
          </div>
        </div>
        <div className="page__footer">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                <section className="feature feature--white">
                  <h2 className="feature__title">{region.name} {_t(region.type)}</h2>
                  <RegionInfoContainer region={region}/>
                <RegionQuickSwitch/>
                </section>
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
