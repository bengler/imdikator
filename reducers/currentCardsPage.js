import {NAVIGATE, SET_CURRENT_CARDS_PAGE} from '../actions/ActionTypes'

export default function currentCardsPage(state = null, action) {
  switch (action.type) {
    case SET_CURRENT_CARDS_PAGE:
      return action.cardsPage
    case NAVIGATE:
      if (!action.match.params.cardsPageName) {
        return null
      }
      return state
    default:
      return state
  }
}
