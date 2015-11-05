import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

class CardPageButtons extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    currentCardsPage: ImdiPropTypes.cardsPage,
    allCardsPages: PropTypes.arrayOf(ImdiPropTypes.cardsPage),
    currentRegion: ImdiPropTypes.region
  }

  static contextTypes = {
    linkTo: PropTypes.func
  }

  render() {
    const {allCardsPages, currentCardsPage, currentRegion} = this.props

    const {linkTo} = this.context

    if (!allCardsPages || !currentRegion) {
      return null
    }

    const summaryPage = {
      name: 'summary',
      title: 'Oppsummert',
      selected: !currentCardsPage,
      url: linkTo('/steder/:region')
    }

    const otherPages = allCardsPages.map(cardsPage => {
      const firstCard = cardsPage.cards[0]
      return {
        name: cardsPage.name,
        title: cardsPage.title,
        selected: cardsPage == currentCardsPage,
        url: linkTo('/steder/:region/:cardsPageName/:cardName', {
          cardsPageName: cardsPage.name,
          cardName: firstCard.name
        })
      }
    })
    const pages = [summaryPage, ...otherPages]
    return (
      <nav className="tabs-button-menu">
        <h2 className="tabs-button-menu__title t-only-screenreaders">Tema:</h2>
        <ul className="t-no-list-styles tabs-button-menu__list">
          {pages.map(page => {
            if (page.selected) {
              return wrap(
                <span className="tabs-button-menu__link tabs-button-menu__link--current">{page.title}</span>
              )
            }

            return wrap(
              <a className="tabs-button-menu__link" href={page.url}>{page.title}</a>
            )

            function wrap(node) {
              return <li key={page.name} className="tabs-button-menu__list-item">{node}</li>
            }
          })}
        </ul>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    allCardsPages: state.allCardsPages,
    currentCardsPage: state.currentCardsPage,
    currentRegion: state.currentRegion
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardPageButtons)
