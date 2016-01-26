import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Card from '../containers/Card'
import smoothscroll from 'smoothscroll'
import {connect} from 'react-redux'
import {openCard, closeCard} from '../../actions/cards'
import * as ImdiPropTypes from '../proptypes/ImdiPropTypes'

function last(arr) {
  return arr[arr.length - 1]
}

class CardList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    cards: PropTypes.arrayOf(ImdiPropTypes.card),
    cardsPage: ImdiPropTypes.cardsPage,
    region: ImdiPropTypes.region,
    openCards: PropTypes.arrayOf(PropTypes.string)
  };

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func,
    navigate: PropTypes.func
  };

  componentDidMount() {
    this.maybeScrollToOpenCard()
  }

  componentDidUpdate(prevProps) {
    if (last(prevProps.openCards) !== last(this.props.openCards)) {
      this.maybeScrollToOpenCard()
    }
  }

  maybeScrollToOpenCard() {
    // Make sure the last opened card is always scrolled into view
    const {openCards} = this.props

    const lastCard = last(openCards)
    if (!lastCard) {
      return
    }

    const container = ReactDOM.findDOMNode(this.refs[`card-${lastCard}`])
    smoothscroll(container, 500)
  }

  renderToggleCardLink(card) {
    const {openCards, dispatch} = this.props
    const {navigate, linkTo} = this.context

    const isOpen = openCards.includes(card.name)
    const prevCard = openCards[openCards.length - 2]

    const handleClick = event => {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      const link = isOpen
        ? linkTo('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName', {cardName: prevCard || ''})
        : linkTo('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName', {cardName: card.name})

      navigate(link, {keepScrollPosition: true})

      if (isOpen) {
        dispatch(closeCard(card.name))
      } else {
        this.props.dispatch(openCard(card.name))
      }
    }
    return (
      <a href={this.context.linkTo('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName', {cardName: card.name})}
        onClick={handleClick}
        className={`toggle-list__button ${card.noValues ? 'toggle-list__button--disablet' : ''} ${isOpen ? 'toggle-list__button--expanded' : ''}`}
        aria-expanded="true"
        aria-controls="befolkning"
        role="button"
      >
        <h3 className="toggle-list__button-title">{card.title}
          <i className="icon__arrow-down toggle-list__button-icon"/>
        </h3>
      </a>
    )
  }

  render() {
    const {region, openCards, cards, cardsPage} = this.props

    return (
      <ul className="t-no-list-styles">
        {cards.map(card => {
          const isOpen = openCards.includes(card.name)
          return (
            <li ref={`card-${card.name}`} key={card.name}>
              <section className="toggle-list">
                {this.renderToggleCardLink(card)}
                {isOpen && !card.noValucontextes && <Card region={region} card={card} cardsPageName={cardsPage.name}/>}
                {isOpen && card.noValues && (
                <div className="toggle-list__section toggle-list__section--expanded">
                  <p>
                    Det finnes ikke noe data for denne visningen. Det kan være at de er skjult av personvernhensyn
                    eller ikke tilgjengelig for denne regionen.
                  </p>
                </div>
                  )}
              </section>
            </li>
          )
        })}
      </ul>
    )
  }
}

function mapStateToProps() {
  return {}
}
// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardList)
