import React, {Component, PropTypes} from 'react'
import {loadCardPages} from '../../actions/cardPages'
import {connect} from 'react-redux'

class App extends Component {
  static propTypes = {
    route: PropTypes.object,
    router: PropTypes.object,
    dispatch: PropTypes.func,
    cardPages: PropTypes.array
  }

  static childContextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  getChildContext() {
    const {router} = this.props
    return {
      linkTo: router.makeLink,
      goTo: (...args) => {
        router.navigate(router.makeLink(...args))
      }
    }
  }

  componentWillMount() {
    this.props.dispatch(loadCardPages())
  }

  renderCardPagesLinks() {
    const {cardPages} = this.props
    return cardPages.map(cardPage => {
      const firstCard = cardPage.cards[0]
      return <a href={this.props.router.makeLink('/steder/:region/:pageName/:cardName', {pageName: cardPage.name, cardName: firstCard.name})}>{cardPage.title}</a>
    })
  }

  render() {
    // Injected by connect() call:
    const {route} = this.props
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
        <route.handler dispatch={this.props.dispatch} route={route}/>
      </div>
    )
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    route: state.route,
    cardPages: state.cardPages
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)
