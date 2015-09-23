import React, {Component, PropTypes} from 'react'
import Card from '../containers/Card'
import {connect} from 'react-redux'
import {loadCardPage} from '../../actions/cardPages'
import {openCard} from '../../actions/cards'
//import {loadCardData} from '../../actions/cards'

function loadData(props) {
  const {route, dispatch} = props
  const [regionCode] = route.params.region.split('-')
  const {pageName, cardName} = route.params
  const tabName = route.splat.split('/')[0] || 'latest'
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

  render() {
    const {pageConfig, region, openCards} = this.props
    if (!pageConfig || !region) {
      return <div>Loading...</div>
    }
    return (
      <div>
        <h2>{pageConfig.title} i {region.name}</h2>
        {pageConfig.cards.map(card => {
          const isOpen = openCards.includes(card.name)
          return (
            <div style={{border: '1px dotted #c0c0c0', marginBottom: 10}}>
              {!isOpen && <a href={this.context.linkTo('/steder/:region/:pageName/:cardName', {cardName: card.name})}>
                <h3>{card.title}</h3>
              </a>}
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
    openCards: state.openCards
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardsPage)
