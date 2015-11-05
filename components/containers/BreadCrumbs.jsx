import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import capitalize from 'lodash.capitalize'
//import util from 'util'

function translateCrumbs(crumbs, region, page, card, tab) {
  return crumbs.map((crumb, index) => {
    let title
    switch (index) {
      case 0:
        title = capitalize(crumb.title) // steder
        break
      case 1:
        title = capitalize(crumb.title) // K0301, maybe translate to region.name instead?
        break
      case 2:
        title = page ? page.title : capitalize(crumb.title) // befolkning --> Befolkning og bosetting
        break
      case 3:
        title = card ? card.title : capitalize(crumb.title) // befolkning_hovedgruppe --> Sammensetning av befolkning
        break
      case 4:
        title = tab ? tab.title : capitalize(crumb.title) // benchmark --> Sammenliknet
        break
      default:
        title = ''
    }
    return Object.assign({}, {url: crumb.url, title: title})
  })
}


class BreadCrumbs extends Component {

  static propTypes = {
    crumbs: PropTypes.array,
    region: PropTypes.object,
    page: PropTypes.object,
    card: PropTypes.object,
    tab: PropTypes.object
  }

  render() {
    const {crumbs, region, page, card, tab} = this.props
    if (!crumbs) {
      return null
    }
    const translatedCrumbs = translateCrumbs(crumbs, region, page, card, tab)

    return (
      <nav className="breadcrumbs">
        <ul className="t-no-list-styles breadcrumbs__list">
          <li key="/" className="breadcrumbs__list-item">
            <a href="/" className="breadcrumbs__link">Tall og statistikk</a>
            <span className="breadcrumbs__divider">/</span>
          </li>
          {translatedCrumbs.map(crumb => (
            <li key={crumb.url} className="breadcrumbs__list-item">
              <a href={crumb.url} className="breadcrumbs__link">
                {crumb.title}
              </a>
              <span className="breadcrumbs__divider">/</span>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
}


function mapStateToProps(state) {
  return {
    crumbs: state.breadCrumbs,
    region: state.currentRegion,
    page: state.currentCardsPage,
    card: state.currentCard,
    tab: state.currentTab
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps)(BreadCrumbs)
