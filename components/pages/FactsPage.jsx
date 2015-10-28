import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Card from '../containers/Card'
import {loadCardPageData, loadCardPages} from '../../actions/cardPages'
import {openCard} from '../../actions/cards'
import {_t} from '../../lib/translate'

const cardsConfig = {}

function loadData(props) {
  const {route, dispatch, cardPagesConfig} = props

  const missingConfig = cardPagesConfig.length == 0

  if (missingConfig) {
    dispatch(loadCardPages())
  } else {
    const prefixedRegionCode = route.params.region.split('-')[0].toUpperCase()
    cardPagesConfig.forEach(page => {
      page.cards.forEach(card => {
        cardsConfig[card.name] = card
        dispatch(loadCardPageData({
          pageName: page.name,
          activeCardName: card.name,
          regionCode: prefixedRegionCode,
          activeTabName: 'latest'
        }))
        dispatch(openCard(card.name))
      })
    })
  }
}

class FactsPage extends Component {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func,
    region: PropTypes.object,
    cardPagesConfig: PropTypes.array,
    cardPagesData: PropTypes.object
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cardPagesConfig.length > 0 && this.props.cardPagesConfig.length == 0) {
      loadData(nextProps)
    }
  }

  render() {
    const {region, cardPagesConfig, cardPagesData} = this.props

    if (!region || !cardPagesConfig || !cardPagesData) {
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
              </div>
            </div>
          </div>
        </div>

        <div className="page__section page__section--grey">
          <div className="wrapper">
            <div className="row">
              <div className="col--main">
                {cardPagesConfig.map(cardPageConfig => {
                  return (
                    <div key={cardPageConfig.name}>
                      <h2 className="feature__section-title">{cardPageConfig.title} i {region.name}</h2>
                      <ul className="t-no-list-styles">
                        {cardPageConfig.cards.map(cardConfig => {
                          if (!cardPagesData[cardPageConfig.name]) {
                            return null
                          }
                          const card = cardPagesData[cardPageConfig.name].cards.find(aCard => aCard.name == cardConfig.name)
                          return (
                            <li key={card.name}>
                              <section className="toggle-list">
                                <h3 className="toggle-list__button-title">{card.title}
                                  <i className="icon__arrow-down toggle-list__button-icon"/>
                                </h3>
                                <Card card={card} pageName={cardPageConfig.name}/>
                              </section>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    region: state.region,
    cardPagesConfig: state.cardPages,
    cardPagesData: state.cardPagesData
  }
}

export default connect(mapStateToProps)(FactsPage)
