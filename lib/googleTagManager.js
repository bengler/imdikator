import {getPageTitle} from './regionUtil'

function generateVirtualPageTitle(state) {
  const {currentCard, currentCardsPage, currentRegion, currentTab, route} = state
  let title = ''

  if (route.url.endsWith('fakta')) {
    // e.g. /K0301/fakta
    title = `${title} ${getPageTitle(currentRegion, 'Faktaark for')}`
  } else {
    // e.g. /K0301 or K0301/kvalifisering/deltagere-introprogram
    if (currentRegion) {
      title = `${title} ${getPageTitle(currentRegion)}`
    }
    if (currentCardsPage && currentCard) {
      title = `${title} - ${currentCard.title}`
    }
    if (currentCardsPage && currentTab) {
      title = `${title} - ${currentTab.title}`
    }
  }
  title = `${title} | IMDi`
  return title
}


export function logCustomPageView(action, state) {
  const title = generateVirtualPageTitle(state)
  const url = state.route.url

  // Google Tag Manager call
  if (typeof window.dataLayer != 'undefined') {
    window.dataLayer.push({
      event: 'customPageView',
      virtualPageUrl: url,
      virtualPageTitle: title
    })
  }
}

export function logCustomEvent(action, state) {
  console.log(action, state)
  // this is wwe want: eventCategory, eventAction, eventLabel, eventValue
  if (typeof window.dataLayer != 'undefined') {
    // window.dataLayer.push({
    //   event: 'customEvent',
    //   eventCategory: eventCategory,
    //   eventAction: eventAction,
    //   eventLabel: eventLabel,
    //   eventValue: eventValue
    // })
  }
}
