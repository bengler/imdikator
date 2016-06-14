import {getPageTitle, getRegionTitle} from './regionUtil'
import {
  OPEN_CARD,
  TRACK_EVENT_CHRONOLOGICAL_TAB_OPEN,
  TRACK_EVENT_BENCHMARK_TAB_OPEN,
  TRACK_EVENT_REGION_COMPARE_OPEN,
  TRACK_EVENT_REGION_COMPARE_COUNT,
  TRACK_EVENT_REGION_COMPARE_ADD,
  TRACK_EVENT_YEAR_CHANGED,
  TRACK_EVENT_BACKGROUND_CHANGED,
  TRACK_EVENT_GENDER_CHANGED,
  TRACK_EVENT_UNIT_CHANGED,
  TRACK_EVENT_OTHER_FILTERS_CHANGED,
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
    title = `${getPageTitle(currentRegion, 'Faktaark for')}`
  } else {
    // e.g. /K0301 or K0301/kvalifisering/deltagere-introprogram
    if (currentRegion) {
      title = `${getPageTitle(currentRegion)}`
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
  const {currentCard, currentRegion} = state
  const event = {
    eventLabel: currentCard.name,
    eventValue: currentCard.title
  }

  switch (action.type) {
    case OPEN_CARD:
      return Object.assign({}, event, {eventCategory: 'iFakta Kort', eventAction: 'Figur åpnet'})
    case TRACK_EVENT_CHRONOLOGICAL_TAB_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Visninger', eventAction: 'Over tid'})
    case TRACK_EVENT_BENCHMARK_TAB_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Visninger', eventAction: 'Sammenliknet'})
    case TRACK_EVENT_REGION_COMPARE_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Valg åpnet', eventAction: 'Sammenliknet med'})
    case TRACK_EVENT_REGION_COMPARE_COUNT:
      return Object.assign({}, event, {eventCategory: 'iFakta Sammenliknet med antall', eventAction: action.count})
    case TRACK_EVENT_REGION_COMPARE_ADD:
      return {
        eventCategory: 'iFakta Sammenliknet med sted',
        eventAction: getRegionTitle(action.region),
        eventLabel: 'Fra sted',
        eventValue: getRegionTitle(currentRegion)
      }
    case TRACK_EVENT_YEAR_CHANGED:
      return Object.assign({}, event, {eventCategory: 'iFakta Filter endringer', eventAction: 'År'})
    case TRACK_EVENT_BACKGROUND_CHANGED:
      return Object.assign({}, event, {eventCategory: 'iFakta Filter endringer', eventAction: 'Bakgrunn'})
    case TRACK_EVENT_GENDER_CHANGED:
      return Object.assign({}, event, {eventCategory: 'iFakta Filter endringer', eventAction: 'Kjønn'})
    case TRACK_EVENT_UNIT_CHANGED:
      return Object.assign({}, event, {eventCategory: 'iFakta Filter endringer', eventAction: 'Enhet'})
    case TRACK_EVENT_OTHER_FILTERS_CHANGED:
      return Object.assign({}, event, {eventCategory: 'iFakta Filter endringer', eventAction: 'Annet'})
    case TRACK_EVENT_HELP_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Valg åpnet', eventAction: 'Veiledning og kilder'})
    case TRACK_EVENT_CHART_LINK_OPEN:
      return Object.assign({}, event, {eventCategory: 'iFakta Valg åpnet', eventAction: 'Lenke til figuren'})
    case TRACK_EVENT_DOWNLOAD_COMPARE_SIMILAR:
      return Object.assign({}, event, {eventCategory: 'iFakta Last ned', eventAction: 'Lignende kommuner, eller andre grupperinger'})
    case TRACK_EVENT_DOWNLOAD_COMPARE_ALL:
      return Object.assign({}, event, {eventCategory: 'iFakta Last ned', eventAction: 'Alle kommuner, eller andre stedstyper'})
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
