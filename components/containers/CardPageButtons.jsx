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

  renderCardPagesLinks() {
    const {cardPages, pageConfig} = this.props
    const currentPageName = pageConfig ? pageConfig.name : null
    return cardPages.map(cardPage => {
      const firstCard = cardPage.cards[0]
      if (currentPageName == cardPage.name) {
        return <span className="tabs-button-menu__link tabs-button-menu__link--current">{cardPage.title}</span>
      }
      return <a className="tabs-button-menu__link" href={this.context.linkTo('/steder/:region/:pageName/:cardName', {pageName: cardPage.name, cardName: firstCard.name})}>{cardPage.title}</a>
    })
  }

  render() {
    const {cardPages} = this.props
    if (!cardPages) {
      return <div>Loading...!</div>
    }

    return (
      <nav className="tabs-button-menu">
        <h2 className="tabs-button-menu__title t-only-screenreaders">Tema:</h2>
        <ul className="t-no-list-styles tabs-button-menu__list">
          {this.renderCardPagesLinks().map(link => {
            return (
              <li className="tabs-button-menu__list-item">
                {link}
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
