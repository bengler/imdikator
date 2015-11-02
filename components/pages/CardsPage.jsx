import React, {Component, PropTypes} from 'react'
import Card from '../containers/Card'
import {connect} from 'react-redux'
import {loadCardPageData} from '../../actions/cardPages'
import {openCard, closeCard} from '../../actions/cards'
import CardPageButtons from '../containers/CardPageButtons'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'
import RegionInfo from '../elements/RegionInfo'
import {_t} from '../../lib/translate'


function loadData(props) {
  const {route, dispatch} = props
  const prefixedRegionCode = route.params.region.split('-')[0].toUpperCase()
  const {pageName, cardName, tabName = 'latest'} = route.params
  // This may be hooked up at a higher level
  dispatch(loadCardPageData({pageName, regionCode: prefixedRegionCode, activeCardName: cardName, activeTabName: tabName}))

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
    allRegions: PropTypes.array,
    cards: PropTypes.array,
    openCards: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.url !== this.props.route.url) {
      loadData(nextProps)
    }
  }

  renderToggleCardLink(card) {
    const {openCards} = this.props

    const isOpen = openCards.includes(card.name)
    const prevCard = openCards[openCards.length - 2]

    const handleClick = event => {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      if (isOpen) {
        this.context.goTo('/steder/:region/:pageName/:cardName', {cardName: prevCard})
        this.props.dispatch(closeCard(card.name))
      } else {
        this.context.goTo('/steder/:region/:pageName/:cardName', {cardName: card.name})
      }
    }
    return (
      <a href={this.context.linkTo('/steder/:region/:pageName/:cardName', {cardName: card.name})}
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
    const {pageConfig, region, openCards, allRegions} = this.props
    if (!pageConfig || !region) {
      return <div>Loading...</div>
    }
    const regionName = region.name == 'Hele landet' ? 'Norge' : `${region.name} ${_t(region.type)}`
    return (
      <div>
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">

                <header>
                  <h1>Integreringen i {regionName}</h1>
                  <p className="ingress">Tall og statistikk over integreringen i {_t('the-' + region.type)}</p>
                </header>
                <CardPageButtons />
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
                      <li key={card.name}>
                        <section className="toggle-list">
                          {this.renderToggleCardLink(card)}
                          {isOpen && <Card card={card} pageName={pageConfig.name}/>}
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
                  <RegionInfo region={region} allRegions={allRegions} />
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

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    pageConfig: state.cardPageData,
    region: state.region,
    openCards: state.openCards,
    allRegions: state.allRegions
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardsPage)
