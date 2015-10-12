import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadCardPages} from '../../actions/cardPages'
import {prefixifyRegion} from '../../lib/regionUtil'

class CardPageButtons extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    pageConfig: PropTypes.object,
    cardPages: PropTypes.array,
    region: PropTypes.object
  }

  static contextTypes = {
    linkTo: PropTypes.func,
    goTo: PropTypes.func
  }

  componentWillMount() {
    this.props.dispatch(loadCardPages())
  }

  render() {
    const {cardPages, pageConfig, region} = this.props
    if (!cardPages || !region) {
      return <div>Loading...!</div>
    }
    const currentPageName = pageConfig ? pageConfig.name : null

    const prefixedRegionCode = prefixifyRegion(region)

    const summaryUrl = this.context.linkTo('/steder/:region', {region: prefixedRegionCode})
    return (
      <nav className="tabs-button-menu">
        <h2 className="tabs-button-menu__title t-only-screenreaders">Tema:</h2>
        <ul className="t-no-list-styles tabs-button-menu__list">
          <li key="summary" className="tabs-button-menu__list-item">
            <a className={`tabs-button-menu__link ${!pageConfig ? 'tabs-button-menu__link--current' : ''}`} href={summaryUrl}>
              Oppsummert
            </a>
          </li>
          {cardPages.map(cardPage => {
            const isButtonForCurrentPage = currentPageName == cardPage.name
            const firstCard = cardPage.cards[0]
            const url = this.context.linkTo('/steder/:region/:pageName/:cardName', {
              region: prefixedRegionCode,
              pageName: cardPage.name,
              cardName: firstCard.name
            })
            return (
              <li key={cardPage.name} className="tabs-button-menu__list-item">
                {isButtonForCurrentPage
                  && <span className="tabs-button-menu__link tabs-button-menu__link--current">{cardPage.title}</span>
                }
                {!isButtonForCurrentPage
                  && <a className="tabs-button-menu__link" href={url}>{cardPage.title}</a>
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
    cardPages: state.cardPages,
    region: state.region
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(CardPageButtons)
