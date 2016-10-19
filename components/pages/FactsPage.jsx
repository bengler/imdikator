import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Card from '../containers/Card'
import {getPageTitle, getPageIngress} from '../../lib/regionUtil'
//import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class FactsPage extends Component {
  static propTypes = {
    region: PropTypes.object,
    cardsPages: PropTypes.array,
    cardPagesData: PropTypes.object
  };

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  };

  render() {
    const {region, cardsPages} = this.props

    const regionPageLink = this.context.linkTo('/tall-og-statistikk/steder/:region/', {region: region.prefixedCode})

    return (
      <div>
        <div className="page__content page__content--section">
          <div className="wrapper">
            <div className="row">
              <div className="col--main-wide">
                <header id="page-header" className="t-no-focus" tabIndex="-1">
                  <h1>{getPageTitle(region, 'Faktaark for')}</h1>
                  <p className="ingress">{getPageIngress(region)}</p>
                  <p className="t-margin-bottom--large t-hide-on-print">
                    <a href={regionPageLink} className="button button--secondary">
                      <i className="icon__arrow-left" /> Tilbake til oppsummering
                    </a>
                  </p>
                </header>
              </div>
            </div>
          </div>
        </div>

        <div className="page__section">
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
                              <div className="toggle-list">
                                <h3 className="toggle-list__button-title">{card.title}</h3>
                                <Card
                                  region={region}
                                  card={card}
                                  cardsPageName={cardsPage.name}
                                  printable
                                />
                              </div>
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
