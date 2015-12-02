import {SET_CURRENT_REGION, OPEN_CARD, CLOSE_CARD} from '../actions/ActionTypes'

export default function cards(state = [], action) {
  switch (action.type) {
    case SET_CURRENT_REGION:
      return []
    case OPEN_CARD:
      return state.filter(cardName => cardName !== action.cardName).concat(action.cardName)
    case CLOSE_CARD:
      return state.filter(cardName => cardName !== action.cardName)
    default:
      return state
  }
}
