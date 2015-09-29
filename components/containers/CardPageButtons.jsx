import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadCardPages} from '../../actions/cardPages'

class CardPageButtons extends Component {

  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func,
    pageConfig: PropTypes.object,
    cardPages: PropTypes.array
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    this.props.dispatch(loadCardPages())
  }


  render() {
    const {cardPages, pageConfig} = this.props
    if (!cardPages) {
      return <div>Loading...!</div>
    }
    const currentPageName = pageConfig ? pageConfig.name : null

    return (
      <nav className="tabs-button-menu">
        <h2 className="tabs-button-menu__title t-only-screenreaders">Tema:</h2>
        <ul className="t-no-list-styles tabs-button-menu__list">
          {cardPages.map(cardPage => {
            const isButtonForCurrentPage = currentPageName == cardPage.name
            const firstCard = cardPage.cards[0]
            return (
              <li key={cardPage.name} className="tabs-button-menu__list-item">
                {isButtonForCurrentPage
                  && <span className="tabs-button-menu__link tabs-button-menu__link--current">{cardPage.title}</span>
                }
                {!isButtonForCurrentPage
                  && <a className="tabs-button-menu__link" href={this.context.linkTo('/steder/:region/:pageName/:cardName', {pageName: cardPage.name, cardName: firstCard.name})}>{cardPage.title}</a>
                }
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
  
}

function mapStateToProps(state) {
  return {
    pageConfig: state.cardPage,
    cardPages: state.cardPages
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardPageButtons)
