import React, {Component, PropTypes} from 'react'
import Card from '../containers/Card'
import {connect} from 'react-redux'
import {getHeaderKey} from '../../lib/regionUtil'
import {openCard, closeCard} from '../../actions/cards'
import CardPageButtonsContainer from '../containers/CardPageButtonsContainer'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'
import RegionInfoContainer from '../containers/RegionInfoContainer'
import {_t} from '../../lib/translate'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class CardsPage extends Component {
  static propTypes = {
    loading: PropTypes.bool,
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

  render() {
    const {cardsPage, region, openCards, cards} = this.props
    if (!cardsPage || !region) {
      return <div>Loading...</div>
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
                </header>
                <CardPageButtonsContainer />
              </div>
            </div>
          </div>
        </div>

        <div className="page__section page__section--grey">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">

                <h2 className="feature__section-title">{cardsPage.title} i {region.name}</h2>
                <ul className="t-no-list-styles">
                  {cards.map(card => {
                    const isOpen = openCards.includes(card.name)
                    return (
                      <li key={card.name}>
                        <section className="toggle-list">
                          {this.renderToggleCardLink(card)}
                          {isOpen && <Card region={region} card={card} cardsPageName={cardsPage.name}/>}
                        </section>
                      </li>
                    )
                  })}
                </ul>
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

  function cardHasValues(card) {
    const regionHeaderKey = getHeaderKey(currentRegion)
    const tableName = card.query.tableName

    if (!(tableName in state.headerGroups)) {
      // Header groups have not arrived for this table yet
      return false
    }

    const headerGroups = state.headerGroups[tableName]

    const hasValues = headerGroups.some(group => {
      return group[regionHeaderKey] && group[regionHeaderKey].includes(currentRegion.code)
    })

    if (!hasValues) {
      console.log(`No values in header groups for ${currentRegion.name} and ${tableName}`)// eslint-disable-line no-console
    }

    return hasValues
  }

  return {
    cards: state.currentCardsPage.cards.filter(cardHasValues),
    cardsPage: state.currentCardsPage,
    region: state.currentRegion,
    openCards: state.openCards
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardsPage)
