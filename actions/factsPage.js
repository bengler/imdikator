import {loadCardsPage} from './cardsPage'

export function loadFactsPageData(regionCode) {
  return (dispatch, getState) => {
    const {allCardsPages} = getState()
    allCardsPages.forEach(page => {
      page.cards.forEach(card => {
        dispatch(loadCardsPage(regionCode, page.name, {
          cardName: card.name,
          tabName: 'latest'
        }))
      })
    })
  }
}
