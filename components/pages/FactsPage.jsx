import React, {Component, PropTypes} from 'react'
import Card from '../containers/Card'
import {connect} from 'react-redux'
import {loadCardPage} from '../../actions/cardPages'
import {openCard, closeCard} from '../../actions/cards'
import CardPageButtons from '../containers/CardPageButtons'
import RegionQuickSwitch from '../containers/RegionQuickSwitch'
import RegionInfo from '../elements/RegionInfo'
import cardPagesConfig from '../../data/cardPages'
import {_t} from '../../lib/translate'


function loadData(props) {
  const {route, dispatch} = props
  const prefixedRegionCode = route.params.region.split('-')[0].toUpperCase()

  cardPagesConfig.forEach(page => {
    dispatch(loadCardPage({pageName: page.name, regionCode: prefixedRegionCode, activeTabName: 'latest'}))
    page.cards.forEach(card => {
      dispatch(openCard(card.name))
    })
  })
}

class FactsPage extends Component {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func,
    cardPages: PropTypes.array,
    region: PropTypes.object,
    allRegions: PropTypes.array,
    cards: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    console.log('componentWillMount')
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.url !== this.props.route.url) {
      loadData(nextProps)
    }
  }

  render() {
    const {pageConfig, region, openCards, allRegions, cards} = this.props
    return (
      <pre>{JSON.stringify(cards, 0, 2)}</pre>
    )

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

                <h2 className="feature__section-title">{pageConfig.title} i {region.name}</h2>
                <ul className="t-no-list-styles">
                  {pageConfig.cards.map(card => {
                    const isOpen = openCards.includes(card.name)
                    return (
                      <li key={card.name}>
                        <section className="toggle-list">
                          <h3 className="toggle-list__button-title">{card.title}
                            <i className="icon__arrow-down toggle-list__button-icon"/>
                          </h3>
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

function mapStateToProps(state) {
  return {
    region: state.region,
    allRegions: state.allRegions,
    cardPages: state.cardPages,
    cards: state.cardState
  }
}

export default connect(mapStateToProps)(FactsPage)
