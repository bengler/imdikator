import {OPEN_CARD, CLOSE_CARD} from '../actions/cards'

export default function cards(state = [], action) {
  switch (action.type) {
    case OPEN_CARD:
      return state.concat(action.cardName)
    case CLOSE_CARD:
      return state.filter(cardName => cardName !== action.cardName)
    default:
      return state
  }
}