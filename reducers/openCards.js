import {OPEN_CARD, CLOSE_CARD} from '../actions/cards'

function remove(array, item) {
  const idx = array.indexOf(item)
  return [...array.slice(0, idx), ...array.slice(idx + 1)]
}

export default function cards(state = [], action) {
  switch (action.type) {
    case OPEN_CARD:
      return remove(state, action.cardName).concat(action.cardName)
    case CLOSE_CARD:
      return remove(state, action.cardName)
    default:
      return state
  }
}
