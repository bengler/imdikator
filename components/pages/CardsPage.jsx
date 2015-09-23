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
    return cardPages.map(cardPage => {
      const firstCard = cardPage.cards[0]
      return <a href={this.context.linkTo('/steder/:region/:pageName/:cardName', {pageName: cardPage.name, cardName: firstCard.name})}>{cardPage.title}</a>
    })
  }

  render() {
    const {pageConfig, region, openCards} = this.props
    if (!pageConfig || !region) {
      return <div>Loading...</div>
    }
    const pageLinkStyle = {
      display: 'inline-block',
      listStyleType: 'none',
      paddingRight: 5
    }

    return (
      <div>

        <ul>
          {this.renderCardPagesLinks().map(link => {
            return <li style={pageLinkStyle}>{link}</li>
          })}
        </ul>

        <h2>{pageConfig.title} i {region.name}</h2>
        {pageConfig.cards.map(card => {
          const isOpen = openCards.includes(card.name)
          return (
            <div style={{border: '1px dotted #c0c0c0', marginBottom: 10}}>
              {!isOpen && (
                <h3>
                  <a href={this.context.linkTo('/steder/:region/:pageName/:cardName', {cardName: card.name})}>
                    {card.title}
                  </a>
                </h3>
              )}
              {isOpen && <Card card={card}/>}
            </div>
          )
        })}
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
