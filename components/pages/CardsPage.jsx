import React, {Component, PropTypes} from 'react'
import Card from '../containers/Card'
import {connect} from 'react-redux'
import {loadCardPage} from '../../actions/cardPages'
import {openCard} from '../../actions/cards'
import {loadCardPages} from '../../actions/cardPages'

function loadData(props) {
  const {route, dispatch} = props
  const [regionCode] = route.params.region.split('-')
  const {pageName, cardName, tabName = 'latest'} = route.params
  // This may be hooked up at a higher level
  dispatch(loadCardPage({pageName, regionCode, activeCardName: cardName, activeTabName: tabName}))
  if (cardName) {
    dispatch(openCard(cardName))
  }
}

class CardsPage extends Component {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func,
    currentCard: PropTypes.object,
    pageConfig: PropTypes.object,
    region: PropTypes.object,
    cardPages: PropTypes.array,
    cards: PropTypes.array,
    openCards: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    loadData(this.props)

    this.props.dispatch(loadCardPages())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.url !== this.props.route.url) {
      loadData(nextProps)
    }
  }

  renderCardPagesLinks() {
    const {cardPages} = this.props
    const currentPageName = this.props.pageConfig.name
    return cardPages.map(cardPage => {
      const firstCard = cardPage.cards[0]
      if (currentPageName != cardPage.name) {
        return <a className="tabs-button-menu__link" href={this.context.linkTo('/steder/:region/:pageName/:cardName', {pageName: cardPage.name, cardName: firstCard.name})}>{cardPage.title}</a>
      }
      return <span className="tabs-button-menu__link tabs-button-menu__link--current">{cardPage.title}</span>
    })
  }

  render() {
    const {pageConfig, region, openCards} = this.props
    if (!pageConfig || !region) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">

                <header>
                  <h1>Integrering i {region.name} {region.type}</h1>
                  <p className="ingress">Tall og statistikk over integreringen i {region.type}.</p>
                </header>

                <nav className="tabs-button-menu">
                  <h2 className="tabs-button-menu__title t-only-screenreaders">Tema:</h2>
                  <ul className="t-no-list-styles tabs-button-menu__list">
                    {this.renderCardPagesLinks().map(link => {
                      return (
                        <li className="tabs-button-menu__list-item">
                          {link}
                        </li>
                      )
                    })}
                  </ul>
                </nav>

              </div>
            </div>
          </div>
        </div>

        <div className="page__section page__section--grey">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">

                <h2 className="feature__section-title">{pageConfig.title} i {region.name}</h2>
                  <ul className="t-no-list-styles">

                    {pageConfig.cards.map(card => {
                      const isOpen = openCards.includes(card.name)
                      return (
                        <li>
                          <section className="toggle-list">
                            <a href={this.context.linkTo('/steder/:region/:pageName/:cardName', {cardName: card.name})} className="toggle-list__button toggle-list__button--expanded" aria-expanded="true" aria-controls="befolkning" role="button">
                              <h3 className="toggle-list__button-title">{card.title}
                                <i className="icon__arrow-down toggle-list__button-icon" />
                              </h3>
                            </a>
                            {isOpen && <Card card={card}/>}
                          </section>
                        </li>
                      )
                    })}
                  </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    //currentCard: state.cards.find(card => card.name == state.currentCard),
    pageConfig: state.cardPage,
    region: state.region,
    openCards: state.openCards,
    cardPages: state.cardPages
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardsPage)
