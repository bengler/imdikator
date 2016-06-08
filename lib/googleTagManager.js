import {getPageTitle} from './regionUtil'
import {
  OPEN_CARD,
  TRACK_EVENT_CHRONOLOGICAL_TAB_OPEN,
  TRACK_EVENT_REGION_COMPARE_OPEN,
  TRACK_EVENT_YEAR_OPEN,
  TRACK_EVENT_HELP_OPEN,
  TRACK_EVENT_CHART_LINK_OPEN,
  TRACK_EVENT_DOWNLOAD_COMPARE_SIMILAR,
  TRACK_EVENT_DOWNLOAD_COMPARE_ALL
} from '../actions/ActionTypes'


function generateVirtualPageTitle(action, state) {
  const {currentCardsPage, currentCard, currentTab, currentRegion, route} = state
  const {cardsPageName, cardName} = action.match.params

  let title = ''

  if (route.url.endsWith('fakta')) {
    // e.g. /K0301/fakta
    title = `${title} ${getPageTitle(currentRegion, 'Faktaark for')}`
  } else {
    // e.g. /K0301 or K0301/kvalifisering/deltagere-introprogram
    if (currentRegion) {
      title = `${title} ${getPageTitle(currentRegion)}`
    }
    if (cardsPageName && !cardName) {
      title = `${title} - ${currentCardsPage.title}`
    }
    if (cardsPageName && cardName) {
      const tabTitle = currentTab.title || 'Enkeltår'
      title = `${title} - ${currentCard.title} - ${tabTitle}`
    }
  }
  title = `${title} | IMDi`
  return title
}

function generateCustomEvent(action, state) {
  const {currentCard} = state
  const event = {
    eventLabel: currentCard.name,
    eventValue: currentCard.title
  }

  switch (action.type) {
    case OPEN_CARD:
      return Object.assign({}, event, {eventCategory: 'iFakta Cards', eventAction: 'Figur åpnet'})
    case TRACK_EVENT_CHRONOLOGICAL_TAB_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Views', eventAction: 'Over tid'})
    case TRACK_EVENT_REGION_COMPARE_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Options opened', eventAction: 'Sammenliknet med'})
    case TRACK_EVENT_YEAR_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Options opened', eventAction: 'År'})
    case TRACK_EVENT_HELP_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Options opened', eventAction: 'Veiledning og kilder'})
    case TRACK_EVENT_CHART_LINK_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Options opened', eventAction: 'Lenke til figuren'})
    case TRACK_EVENT_DOWNLOAD_COMPARE_SIMILAR:
      return Object.assign({}, event, {eventCategory: 'iFakta Download', eventAction: 'Lignende kommuner'})
    case TRACK_EVENT_DOWNLOAD_COMPARE_ALL:
      return Object.assign({}, event, {eventCategory: 'iFakta Download', eventAction: 'Alle kommuner'})
    default:
      return {}
  }
}


export function logCustomPageView(action, state) {
  const url = state.route.url
  const title = generateVirtualPageTitle(action, state)

  // Call Google Tag Manager regarding custom page view
  if (typeof window.dataLayer != 'undefined') {
    window.dataLayer.push({
      event: 'customPageView',
      virtualPageUrl: url,
      virtualPageTitle: title
    })
  }
}


export function logCustomEvent(action, state) {
  const {eventCategory, eventAction, eventLabel, eventValue} = generateCustomEvent(action, state)

  // Call Google Tag Manager regarding a custom event
  if (typeof window.dataLayer != 'undefined') {
    window.dataLayer.push({
      event: 'customEvent',
      eventCategory,
      eventAction,
      eventLabel,
      eventValue
    })
  }
}
