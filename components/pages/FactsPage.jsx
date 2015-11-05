import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Card from '../containers/Card'
import {_t} from '../../lib/translate'
//import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class FactsPage extends Component {
  static propTypes = {
    region: PropTypes.object,
    cardsPages: PropTypes.object,
    cardPagesData: PropTypes.object
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  render() {
    const {region, cardsPages} = this.props

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
                {cardsPages.map(cardsPage => {
                  return (
                    <div key={cardsPage.name}>
                      <h2 className="feature__section-title">{cardsPage.title} i {region.name}</h2>
                      <ul className="t-no-list-styles">
                        {cardsPage.cards.map(card => {
                          return (
                            <li key={card.name}>
                              <section className="toggle-list">
                                <h3 className="toggle-list__button-title">{card.title}
                                  <i className="icon__arrow-down toggle-list__button-icon"/>
                                </h3>
                                <Card
                                  region={region}
                                  card={card}
                                  cardsPageName={cardsPage.name}
                                />
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
    cardsPages: state.allCardsPages,
    region: state.currentRegion
  }
}

export default connect(mapStateToProps)(FactsPage)
