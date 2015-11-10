import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import capitalize from 'lodash.capitalize'
//import util from 'util'

function translateCrumbs(crumbs, region, page, card, tab) {
  return crumbs.map((crumb, index) => {
    let title
    switch (index) {
      case 0:
        // skip "steder" level, but show any other route
        return crumb.title.toLowerCase() == 'steder' ? null : {url: crumb.url, title: capitalize(crumb.title)}
      case 1:
        return {url: crumb.url, title: capitalize(region.name)} // Oslo
      case 2:
        title = page ? page.title : capitalize(crumb.title) // befolkning --> Befolkning og bosetting
        return {url: crumb.url, title: title}
      case 3:
        title = card ? card.title : capitalize(crumb.title) // befolkning_hovedgruppe --> Sammensetning av befolkning
        return {url: crumb.url, title: title}
      case 4:
        // skip this level if we're showing a tab, but pass thru other stuff if thar be such
        return tab ? null : {url: crumb.url, title: crumb.title}
      default:
        return null
    }
  }).filter(Boolean)
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
          </li>
          {translatedCrumbs.map(crumb => (
            <li key={crumb.url} className="breadcrumbs__list-item">
              <span className="breadcrumbs__divider">/</span>
              <a href={crumb.url} className="breadcrumbs__link">
                {crumb.title}
              </a>
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
